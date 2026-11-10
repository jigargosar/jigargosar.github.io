---
title: '[working title] Claude Code''s /cd moves your transcript, and no hook tells you'
date: '2026-11-10'
intro: If a tool of yours reads Claude Code's conversation file, that file can change its name or its folder in the middle of a session. Here is when that happens, which hooks report it, and how I tested it.
slug: 'claude-code-transcript-path'
tag: 'deep-dive'
---

<!--
Draft notes, remove before publishing:
- Hero image still missing.
- The driver below imports node-pty and xterm-headless directly. The tested copy loaded them from another project's node_modules with createRequire. Rerun once with the published version.
- Tested on Windows 11 only. macOS and Linux not tried.
-->

## The setup

I run Claude Code inside a pseudo-terminal and show the conversation in a browser tab next to it. A small server reads Claude Code's transcript file and turns each new line into something the page can render.

The server learns where that file is from one hook. On `SessionStart`, a hook POSTs `transcript_path` to the server, and the server tails that file for the rest of its life.

That worked until I ran `/cd`. The terminal kept going. The browser tab froze on the old conversation.

This post is what I found out while fixing that. Everything was tested on Claude Code 2.1.322, Windows 11, on 2026-11-10.

## Two things that can change

Claude Code keeps each conversation in one JSONL file:

```
~/.claude/projects/<project>/<session_id>.jsonl
```

`<project>` is the working directory with `:`, `\` and `/` replaced by `-`. So `C:\Users\me\work\app` becomes `C--Users-me-work-app`.

That gives two separate ways for your file to change under you:

1. The session ID changes. A different conversation starts, with a new file.
2. The session ID stays, but the working directory changes. The same file moves to a different project folder.

Every hook event receives both values. From the [hooks reference](https://code.claude.com/docs/en/hooks#common-input-fields), as of 2026-11-10:

> `session_id`: Current session identifier
>
> `transcript_path`: Path to conversation JSON. The transcript file is written asynchronously and may lag the in-memory conversation, so it may not yet include the current turn's most recent messages when a hook fires.
>
> `cwd`: Current working directory when the hook is invoked

So the question is not "which event has the path". They all do. The question is which event fires right after the path changes.

## What changes the session ID

All of these fire `SessionStart`, and the `source` field tells you why. From the [SessionStart section](https://code.claude.com/docs/en/hooks#sessionstart):

| Matcher | When it fires |
| :- | :- |
| `startup` | New session |
| `resume` | `--resume`, `--continue`, or `/resume` |
| `clear` | `/clear` |
| `compact` | Auto or manual compaction |
| `fork` | A new session forked from an existing one: `--fork-session` with `--resume` or `--continue`, the `/fork` background copy, `/branch`, or a conversation you move to the background |

`compact` does not change the ID. In my one compacted transcript, every line had the same `sessionId` and the file kept its name.

`/clear` and `/resume` also fire `SessionEnd` for the conversation you leave, with `reason` set to `clear` or `resume`.

## What moves the file but keeps the ID

Two things, per the docs.

`/cd`, from the [sessions page](https://code.claude.com/docs/en/sessions#where-the-session-picker-looks):

> Moving a session with `/cd` relocates it to the new directory's project storage, so it appears in that directory's picker afterward.

Entering or leaving a worktree, from the [worktrees page](https://code.claude.com/docs/en/worktrees#resume-a-worktree-session):

> When Claude enters or exits a worktree that Claude Code created with git, the transcript follows. Claude Code records the session under the session's new working directory, the same way `/cd` does, so `/desktop` and `--resume` find it there. Exiting moves it back the same way. A worktree created by a `WorktreeCreate` hook keeps its transcript at the launch directory.

Neither page says which hook, if any, fires when that happens. So I tested it.

## How I tested it

### A hook that logs every event

One hook command for every event. It appends one line per event with the arrival time and the fields that locate the conversation.

`log.mjs`:

```js
// Appends one line per hook event: arrival time plus the fields that locate the conversation.
import { appendFileSync, readFileSync } from "node:fs";

const input = JSON.parse(readFileSync(0, "utf8"));
const pick = ({ hook_event_name, session_id, transcript_path, cwd, agent_id, agent_type, agent_transcript_path, source, reason, old_cwd, new_cwd, tool_name }) =>
  ({ hook_event_name, session_id, transcript_path, cwd, agent_id, agent_type, agent_transcript_path, source, reason, old_cwd, new_cwd, tool_name });
appendFileSync(process.argv[2], JSON.stringify({ at: new Date().toISOString(), ...pick(input), keys: Object.keys(input) }) + "\n");
```

`make-settings.mjs` writes a settings file that registers it on 27 events:

```js
// Usage: node make-settings.mjs <probe dir>. Writes <probe dir>/settings.json.
import { writeFileSync } from "node:fs";

const dir = process.argv[2];
const events = "SessionStart UserPromptSubmit UserPromptExpansion PreToolUse PermissionRequest PermissionDenied PostToolUse PostToolUseFailure PostToolBatch Notification MessageDisplay SubagentStart SubagentStop TaskCreated TaskCompleted Stop StopFailure TeammateIdle InstructionsLoaded ConfigChange CwdChanged DirectoryAdded PreCompact PostCompact PreModelSwitch PostModelSwitch SessionEnd".split(" ");
const command = `node ${dir}/log.mjs ${dir}/events.jsonl`;
const hooks = Object.fromEntries(events.map((e) => [e, [{ hooks: [{ type: "command", command }] }]]));
writeFileSync(`${dir}/settings.json`, JSON.stringify({ hooks }, null, 1));
```

Six events are left out on purpose:

- `WorktreeCreate`. Registering any hook on it replaces Claude Code's own git worktree creation. The [hooks reference](https://code.claude.com/docs/en/hooks#hook-lifecycle) lists it as "Replaces default git behavior". A logger there would break the very thing I wanted to test.
- `WorktreeRemove`. It fires only for worktrees that a `WorktreeCreate` hook made.
- `Setup`, `FileChanged`, `Elicitation` and `ElicitationResult`. Not relevant here.

### Driving a real interactive session

`/cd`, `/clear` and `/resume` are interactive commands. A `claude -p` run can't show what they do, so I drove a real session through a pseudo-terminal.

The driver starts `claude` in a pty and writes each new line of `cmd.txt` to it as keystrokes. Every second it dumps the visible screen to `screen.txt`, so a script, or you, can see what Claude Code is showing.

`drive.mjs`, which needs `npm i @lydell/node-pty @xterm/headless`:

```js
// Usage: node drive.mjs <probe dir> <working dir> [claude args...]
// Each new line of <probe dir>/cmd.txt is a JSON string written to the pty.
// The visible screen is dumped to <probe dir>/screen.txt every second. Exits after 20 minutes or when claude exits.
import { readFileSync, writeFileSync, watchFile } from "node:fs";
import { spawn } from "@lydell/node-pty";
import headless from "@xterm/headless";

const [P, cwd, ...args] = process.argv.slice(2);
const cmdFile = `${P}/cmd.txt`;
writeFileSync(cmdFile, "");
const term = new headless.Terminal({ cols: 120, rows: 40, scrollback: 2000, allowProposedApi: true });
// Drop the CLAUDE* variables inherited from a Claude Code session that runs this script.
const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => !k.startsWith("CLAUDE")));
const exe = process.platform === "win32" ? "claude.exe" : "claude";
const pty = spawn(exe, args, { name: "xterm-256color", cols: 120, rows: 40, cwd, env: { ...env, TERM: "xterm-256color" } });
pty.onData((d) => term.write(d));
pty.onExit(({ exitCode }) => { dump(); console.log("claude exited", exitCode); process.exit(0); });

const dump = () => {
  const b = term.buffer.active;
  const lines = [];
  for (let i = b.viewportY; i < b.viewportY + term.rows; i++) lines.push(b.getLine(i)?.translateToString(true) ?? "");
  writeFileSync(`${P}/screen.txt`, lines.join("\n"));
};
setInterval(dump, 1000);

let done = 0;
watchFile(cmdFile, { interval: 300 }, () => {
  const lines = readFileSync(cmdFile, "utf8").split("\n").filter(Boolean);
  for (const l of lines.slice(done)) pty.write(JSON.parse(l));
  done = lines.length;
});
setTimeout(() => { pty.kill(); process.exit(0); }, 20 * 60 * 1000);
```

Start it:

```sh
node drive.mjs "$PROBE" "$PROBE/repo" --model haiku --settings "$PROBE/settings.json"
```

Type into it. Text and Enter go as two writes, since the prompt can treat a pasted `\r` as part of the text:

```sh
printf '%s\n' '"/cd ../other"' >> "$PROBE/cmd.txt"; sleep 1; printf '%s\n' '"\r"' >> "$PROBE/cmd.txt"
```

`$PROBE` holds a scratch git repo `repo/` with one commit, and an empty sibling folder `other/`.

### The first attempt was void

My first runs started `claude` from inside a Claude Code session. The child inherited its parent's environment, and the status bar said:

```
⚠ Transcript saving is off — inherited CLAUDE_CODE_CHILD_SESSION marker
```

No transcript means no file to follow. The parent also passed down `CLAUDE_BASH_MAINTAIN_PROJECT_WORKING_DIR`, which resets the shell to the project folder after every Bash command. So a test of `cd` from inside such a child tells you nothing either.

The fix is the `env` filter in the driver: drop every variable that starts with `CLAUDE`. If you write your own driver and launch it from Claude Code, do the same.

## Results

### `/cd`

Steps: a prompt, `/cd ../other`, a prompt, `/cd ../repo`, a prompt, `/exit`. Times are UTC. The folder column is the project folder inside `transcript_path`.

| Time | Step | Events | Session | Folder |
| :- | :- | :- | :- | :- |
| 06:51:40 | start in `repo` | `SessionStart` startup, `InstructionsLoaded` | `676f7d62` | `…-repo` |
| 06:51:56 | prompt | `UserPromptSubmit`, `MessageDisplay`, `Stop` | `676f7d62` | `…-repo` |
| ~06:52:10 | `/cd ../other` | none | | |
| 06:52:32 | prompt | `UserPromptSubmit`, `MessageDisplay`, `Stop` | `676f7d62` | `…-other` |
| ~06:52:45 | `/cd ../repo` | none | | |
| 06:52:54 | prompt | `UserPromptSubmit`, `MessageDisplay`, `Stop` | `676f7d62` | `…-repo` |
| 06:53:30 | `/exit` | `SessionEnd` prompt_input_exit | `676f7d62` | `…-repo` |

Nothing fires at `/cd`. Not `CwdChanged`, not `InstructionsLoaded`, not `UserPromptExpansion`.

I wondered if that was because `/cd` reloads settings, and the move dropped events in between. So in this run, each folder also had the same logger in its own `.claude/settings.local.json`, writing to its own log. The folder hooks switched over cleanly: `repo`'s logger went quiet while the session sat in `other`, then woke up again after `/cd ../repo`. None of the three loggers saw anything at the moment of either `/cd`.

The first event after a `/cd` is the next prompt's `UserPromptSubmit`, and it already carries the new `transcript_path` and `cwd`.

### Worktrees

Steps: a prompt, ask Claude to use `EnterWorktree` with the name `probe`, a prompt, ask Claude to use `ExitWorktree` with `keep`.

| Time | Step | Event | Folder |
| :- | :- | :- | :- |
| 07:01:41 | ask to enter | `UserPromptSubmit` | `…-repo` |
| 07:01:48 | tool ran | `PostToolUse` `EnterWorktree` | `…-repo--claude-worktrees-probe` |
| 07:01:49 | turn ends | `Stop` | `…-repo--claude-worktrees-probe` |
| 07:02:11 | prompt | `UserPromptSubmit`, `Stop` | `…-repo--claude-worktrees-probe` |
| 07:02:29 | tool ran | `PostToolUse` `ExitWorktree` | `…-repo` |
| 07:02:31 | turn ends | `Stop` | `…-repo` |

`EnterWorktree` and `ExitWorktree` are tools, so they fire `PostToolUse`. That event already carries the new path, and it comes before the rest of the turn is written. The session ID stayed `6bd5cac8` throughout.

### `/clear` and `/resume`

Same session, continued:

| Time | Step | Events | Session |
| :- | :- | :- | :- |
| 07:02:51 | `/clear` | `SessionEnd` clear | `6bd5cac8` |
| 07:02:52 | | `SessionStart` clear | `1da22bba` |
| 07:03:10 | `/resume 6bd5cac8-…` | `SessionEnd` resume | `1da22bba` |
| 07:03:10 | | `SessionStart` resume | `6bd5cac8` |

Both `SessionStart` events named the right file.

## The nuances

The file moves. It isn't copied. After `/cd ../other` and back, `other`'s project folder held no copy. After `ExitWorktree`, the worktree's project folder was empty. So between a `/cd` and the next prompt, the path you were tailing no longer exists.

Mostly, anyway. In my older history, one session that had been moved with `/cd` left a 1 KB stub with the same name in the old folder, next to the real 4.4 MB file in the new one. If you search for `<session_id>.jsonl` across all project folders, pick the copy written most recently.

The transcript records `/cd` itself. Right at the move, it gets a `system` line with subtype `local_command` holding `<command-name>/cd</command-name>`, then a second one with the output `Moved to …`. These lines land in the moved file.

A shell `cd` moves nothing. Neither a Bash tool call `cd a` nor a `! cd sub` typed at the prompt fired `CwdChanged` for me. Both were reset, with "Shell cwd was reset to …", and `cwd` never changed. The docs say `CwdChanged` "runs when a shell command in the main conversation changes the working directory". I didn't find out what reset the shell in my setup.

`UserPromptExpansion` doesn't help either. It matches on a slash command's name, but only "when a user-typed command expands into a prompt", which means skills, custom commands and MCP prompts. `/cd` expands into nothing.

A worktree made by hand doesn't move the session. If Claude runs `git worktree add` through Bash, the session and its file stay in the launch folder, and Claude works there by path. The session moves only through `/cd`, or through `EnterWorktree`, which can also take the `path` of an existing worktree.

Subagents write their own files. The [subagents page](https://code.claude.com/docs/en/sub-agents#resume-subagents) says they live at `~/.claude/projects/{project}/{sessionId}/subagents/agent-{agentId}.jsonl`. The main `transcript_path` doesn't change when one runs. If you take paths from many events, don't count on `agent_id` to filter out subagent events. Open issues report compaction events from subagents that come without it ([#91910](https://github.com/anthropics/claude-code/issues/91910), [#102428](https://github.com/anthropics/claude-code/issues/102428)).

The status line gets the same data, plus more directory fields. From the [status line page](https://code.claude.com/docs/en/statusline#available-data):

| Field | Meaning |
| :- | :- |
| `cwd`, `workspace.current_dir` | Same value: the current working directory |
| `workspace.project_dir` | The folder Claude Code was launched in, which never changes |
| `workspace.git_worktree` | The name of the linked git worktree the current folder is in, set for any git worktree |
| `worktree.*` | Present only while Claude Code itself has moved the session into a worktree |

One report says `workspace.current_dir` stayed at the launch folder after `EnterWorktree` ([#90934](https://github.com/anthropics/claude-code/issues/90934), 2.1.251). The bot closed it for inactivity, with no fix noted. I didn't test the status line.

## What I didn't test

- Fork: `--fork-session`, `/fork`, `/branch`, or moving a session to the background. The docs say each one fires `SessionStart` with `fork`.
- A session launched inside a worktree with `--worktree`. One report says `transcript_path` named a folder that didn't exist ([#44450](https://github.com/anthropics/claude-code/issues/44450), 2.1.137), and it was closed for inactivity.
- `SessionStart` for a session that never gets a transcript. It's reported in [#78455](https://github.com/anthropics/claude-code/issues/78455), still open.
- Rewind. It keeps the same ID and the same file, and no hook fires for it. A `PostRewind` event is an open request ([#95722](https://github.com/anthropics/claude-code/issues/95722)).

## What I ended up with

Three hooks, each POSTing the event's `session_id` and `transcript_path`:

| Hook | Matcher | Covers |
| :- | :- | :- |
| `SessionStart` | any | startup, `/resume`, `/clear`, fork |
| `UserPromptSubmit` | any | `/cd`, at the next prompt |
| `PostToolUse` | `EnterWorktree\|ExitWorktree` | worktree moves mid-turn |

The server follows whichever path came last. When it switches, it reads the new file from the start, so the `/cd` lines written before the next prompt still show up. And until the next prompt arrives, it has to cope with the old path having vanished.

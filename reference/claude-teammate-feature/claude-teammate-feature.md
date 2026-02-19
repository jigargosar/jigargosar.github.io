# Claude Code Agent Teams — Technical Reference

## Overview

Agent Teams is an experimental orchestration system in Claude Code CLI that coordinates multiple independent Claude Code sessions working on a shared codebase. One session acts as the **team lead** — it creates the team, spawns teammates, creates tasks, and synthesizes results. **Teammates** are full Claude Code instances, each with their own context window, that work in parallel, communicate with each other directly, and coordinate through a shared task list.

The feature ships disabled. It is not a wrapper or abstraction — it is a set of primitives (tools) that the lead agent uses to create infrastructure (directories, config files, task files) and spawn processes that communicate via a mailbox system backed by the filesystem.

---

## Enabling

Add to `~/.claude/settings.json`:

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

This unlocks seven tools: `TeamCreate`, `TaskCreate`, `TaskUpdate`, `TaskList`, `TaskGet`, `SendMessage`, `TeamDelete`.

---

## Architecture

An agent team is composed of five components:

```
+====================+============================================================+
| Component          | Description                                                |
+====================+============================================================+
| Team Lead          | The session that calls TeamCreate. Fixed for the team's    |
|                    | lifetime — cannot be transferred or promoted.              |
+--------------------+------------------------------------------------------------+
| Teammates          | Full Claude Code instances spawned via the Task tool with  |
|                    | a team_name parameter. Each has its own context window.    |
+--------------------+------------------------------------------------------------+
| Team Config        | ~/.claude/teams/{name}/config.json — member registry with  |
|                    | name, agentId, agentType for each teammate.                |
+--------------------+------------------------------------------------------------+
| Task List          | ~/.claude/tasks/{name}/ — directory of JSON task files     |
|                    | with status, ownership, and dependency tracking.           |
+--------------------+------------------------------------------------------------+
| Mailbox            | Filesystem-backed message queue. Messages between agents   |
|                    | are delivered automatically as new conversation turns.     |
+====================+============================================================+
```

### What "full Claude Code instance" means

Each teammate loads the same project context a normal session would: `CLAUDE.md`, MCP servers, skills, and the working directory. It does **not** inherit the lead's conversation history. The teammate starts fresh with only its spawn prompt as context. This is the critical design constraint — everything the teammate needs to know must be in its prompt or discoverable from the filesystem.

### What the lead is

The session that calls `TeamCreate` becomes the lead. There is no separate "lead agent" to spawn — you are the lead the moment you create the team. The lead has access to all team tools and receives messages from teammates automatically. It cannot delegate leadership.

---

## Agent Teams vs Subagents

Both parallelize work. The difference is communication topology.

```
+====================+================================+================================+
| Dimension          | Subagents                      | Agent Teams                    |
+====================+================================+================================+
| Spawning           | Task tool (no team_name)       | Task tool (with team_name)     |
+--------------------+--------------------------------+--------------------------------+
| Communication      | Results return to parent only.  | Any teammate can message any   |
|                    | Subagents cannot talk to each  | other teammate directly.       |
|                    | other.                         |                                |
+--------------------+--------------------------------+--------------------------------+
| Coordination       | Parent manages all work.       | Shared task list. Teammates    |
|                    |                                | self-claim unblocked tasks.    |
+--------------------+--------------------------------+--------------------------------+
| Context            | Runs in parent's context       | Own context window. Does not   |
|                    | window. Results summarized     | inherit lead's history.        |
|                    | back.                          |                                |
+--------------------+--------------------------------+--------------------------------+
| Lifecycle          | Spawned, runs, returns result, | Spawned, joins team, works     |
|                    | gone.                          | tasks, messages peers, must    |
|                    |                                | be explicitly shut down.       |
+--------------------+--------------------------------+--------------------------------+
| Token cost         | Lower — result fits in         | Higher — each teammate is a    |
|                    | parent's context.              | separate billing instance.     |
+--------------------+--------------------------------+--------------------------------+
| Best for           | Focused tasks where only the   | Complex work requiring peer    |
|                    | result matters.                | discussion and collaboration.  |
+====================+================================+================================+
```

**Rule of thumb**: If workers only need to report back, use subagents. If workers need to share findings, debate, or build on each other's work, use agent teams.

---

## The Seven Primitives

### 1. TeamCreate

Creates the team infrastructure: config directory and task directory.

```
TeamCreate({
  team_name: "svg-art",
  description: "Collaborative SVG art creation"
})
```

Creates:
- `~/.claude/teams/svg-art/config.json` — member registry
- `~/.claude/tasks/svg-art/` — task file directory

The calling session becomes the team lead. Always the first call. One team per session — you cannot create a second team without deleting the first.

### 2. TaskCreate

Defines a unit of work as a JSON file in the task directory.

```
TaskCreate({
  subject: "Create geometric SVG art",
  description: "Create a unique SVG art piece focused on geometric patterns...",
  activeForm: "Creating geometric SVG art"
})
```

Fields:
- `subject` — imperative title ("Create X", "Review Y")
- `description` — detailed requirements the claiming teammate will read
- `activeForm` — present-continuous form shown in UI spinner ("Creating X")
- Returns a sequential task ID (`#1`, `#2`, `#3`, ...)

Tasks are created with status `pending` and no owner. They become claimable immediately unless blocked by dependencies.

### 3. TaskUpdate

Modifies task state. Used for three purposes: claiming, completing, and setting dependencies.

**Claiming a task:**
```
TaskUpdate({ taskId: "1", owner: "artist-geo", status: "in_progress" })
```

**Completing a task:**
```
TaskUpdate({ taskId: "1", status: "completed" })
```

**Setting dependencies:**
```
TaskUpdate({ taskId: "4", addBlockedBy: ["1", "2", "3"] })
```

File locking prevents two teammates from claiming the same task simultaneously. A task with unresolved `blockedBy` entries cannot be claimed — it auto-unblocks when all dependencies complete.

### 4. TaskList / TaskGet

**TaskList** returns all tasks with their current status, owner, and blocked-by list. Teammates call this after completing a task to discover the next available work.

```
TaskList()
→ #1 [completed] Create geometric SVG art (artist-geo)
  #2 [completed] Create organic SVG art (artist-organic)
  #3 [in_progress] Create gradient SVG art (artist-gradient)
  #4 [pending] Compose masterpiece [blocked by #1, #2, #3]
```

**TaskGet** retrieves full details for a single task including its description.

These are read-only — they never mutate state.

### 5. Task (with team_name parameter)

Spawns a teammate. This is the standard `Task` tool with the `team_name` and `name` parameters set, which links the spawned agent to the team.

```
Task({
  team_name: "svg-art",
  name: "artist-geo",
  subagent_type: "general-purpose",
  model: "sonnet",
  prompt: "You are artist-geo on team svg-art. Your mission: ..."
})
```

Key parameters:
- `team_name` — links to the shared task list and config
- `name` — human-readable identifier used for messaging and task ownership
- `subagent_type` — determines what tools the teammate has access to
- `model` — can differ from the lead's model (e.g., lead on Opus, teammates on Sonnet)
- `mode` — permission mode (`bypassPermissions`, `default`, etc.)
- `run_in_background` — teammates typically run in background so the lead can spawn multiple in parallel

The teammate joins the team's member registry in `config.json` and can access the shared task list. Multiple teammates can be spawned in a single message (parallel `Task` calls).

### 6. SendMessage

Inter-agent communication. Five message types:

```
+====================+===============================================================+
| Type               | Purpose                                                       |
+====================+===============================================================+
| message            | DM to one specific teammate by name. Primary communication    |
|                    | channel.                                                      |
+--------------------+---------------------------------------------------------------+
| broadcast          | Send to ALL teammates simultaneously. Expensive — costs scale |
|                    | linearly with team size. Use only for critical announcements. |
+--------------------+---------------------------------------------------------------+
| shutdown_request   | Ask a teammate to gracefully exit. Teammate can approve or    |
|                    | reject.                                                       |
+--------------------+---------------------------------------------------------------+
| shutdown_response  | Teammate's response to a shutdown request. Approve = exit.    |
|                    | Reject = continue working with reason.                        |
+--------------------+---------------------------------------------------------------+
| plan_approval      | Lead approves or rejects a teammate's implementation plan     |
| _response          | (when plan mode is required).                                 |
+====================+===============================================================+
```

**Sending a DM:**
```
SendMessage({
  type: "message",
  recipient: "artist-organic",
  content: "Here is my SVG source: <svg>...</svg>",
  summary: "Sharing geometric SVG"
})
```

**Requesting shutdown:**
```
SendMessage({
  type: "shutdown_request",
  recipient: "artist-geo",
  content: "All tasks complete."
})
```

Messages are delivered automatically as new conversation turns — recipients don't need to poll. The `summary` field appears as a preview in the UI.

### 7. TeamDelete

Removes team config and task directories. Fails if teammates are still active — shut them down first.

```
TeamDelete()
```

Always called by the lead as the final operation. Teammates should not call this — their team context may not resolve correctly.

---

## Lifecycle

The complete lifecycle of an agent team session:

```
1. Lead calls TeamCreate
   → Creates ~/.claude/teams/{name}/ and ~/.claude/tasks/{name}/

2. Lead calls TaskCreate × N
   → Creates task files with dependencies
   → TaskUpdate to set blockedBy relationships

3. Lead calls Task × N (in parallel)
   → Spawns teammates, each joins the team
   → Each teammate appears in config.json

4. Teammates execute
   → Call TaskList to discover available tasks
   → Claim tasks with TaskUpdate (owner + in_progress)
   → Do the work (read/write files, run commands)
   → Share results with peers via SendMessage
   → Mark tasks completed with TaskUpdate
   → Call TaskList again to find next unblocked task
   → Repeat until no tasks remain

5. Lead receives
   → Automatic idle notifications when teammates finish turns
   → Direct messages with results/findings
   → Can intervene by messaging teammates directly

6. Lead synthesizes
   → Collects results from all teammates
   → Produces final deliverable

7. Lead shuts down team
   → SendMessage(shutdown_request) to each teammate
   → Teammates approve shutdown
   → Lead calls TeamDelete to clean up
```

### Concrete example: our art team session

```
TeamCreate({ team_name: "svg-art" })

TaskCreate × 3:
  #1 "Create geometric SVG art"
  #2 "Create organic SVG art"
  #3 "Create gradient abstract SVG art"

TaskCreate #4: "Compose final masterpiece (art.html)"
  → TaskUpdate({ taskId: "4", addBlockedBy: ["1", "2", "3"] })

Task × 3 (parallel spawn):
  artist-geo    → claimed #1, created svg-geometric.svg
  artist-organic → claimed #2, created svg-organic.svg
  artist-gradient → claimed #3, created svg-gradients.svg

Each artist:
  → Wrote their SVG file
  → Read config.json to discover teammates
  → Sent SVG source to peers via SendMessage
  → Sent SVG source to lead via SendMessage
  → Marked their task completed

Lead:
  → Received 3 SVGs via automatic message delivery
  → Marked tasks #1-#3 completed
  → Claimed task #4 (now unblocked)
  → Composed art.html layering all 3 SVGs with CSS blend modes
  → Sent shutdown_request to all 3 artists
  → Called TeamDelete
```

---

## Task System

### States

```
pending → in_progress → completed
```

- **pending** — available for claiming (unless blocked)
- **in_progress** — owned by a specific teammate
- **completed** — work is done

Tasks can also be set to `deleted` to permanently remove them.

### Dependencies

Tasks can declare `blockedBy` relationships. A blocked task cannot be claimed until all its dependencies are completed. When a dependency completes, blocked tasks auto-unblock.

This enables **wave-based execution**:
- Wave 1: All independent tasks run in parallel
- Wave 2: Tasks that depended on wave 1 auto-unblock and run
- Wave N: Continues until all tasks complete

In our art example: tasks #1-#3 (art creation) ran in wave 1. Task #4 (composition) was blocked by all three and ran in wave 2 after they completed.

### Claiming and file locking

When a teammate calls `TaskUpdate` to claim a task, the system uses file locking to prevent race conditions. Two teammates cannot claim the same task simultaneously — the second one's claim will fail, and it should call `TaskList` again to find a different task.

### Self-claiming pattern

The recommended pattern for teammates:

```
1. Call TaskList()
2. Find first task with status=pending, no owner, empty blockedBy
3. Claim it with TaskUpdate(owner=myName, status=in_progress)
4. Do the work
5. Mark completed with TaskUpdate(status=completed)
6. Go to step 1
7. When no tasks remain, go idle
```

This is decentralized — the lead doesn't need to assign every task. Teammates pull work autonomously.

---

## Communication Model

### Message delivery

Messages are delivered **automatically** as new conversation turns. When teammate A sends a message to teammate B, it appears in B's conversation as if a user had typed it. The recipient does not need to poll or check an inbox.

### Idle notifications

When a teammate's turn ends (it finishes processing and stops), the system automatically sends an idle notification to the lead. This is **normal behavior**, not an error. An idle teammate can still receive messages — sending it a message wakes it up for a new turn.

### Peer-to-peer messaging

Any teammate can message any other teammate directly, without routing through the lead. This is the key architectural difference from subagents. It enables:

- Artists sharing their SVGs with each other to discuss composition
- Debuggers challenging each other's hypotheses
- Reviewers cross-referencing findings from different perspectives

### Team discovery

Teammates discover each other by reading the team config file:

```
~/.claude/teams/{team-name}/config.json
```

This contains a `members` array with each teammate's `name`, `agentId`, and `agentType`. Teammates should always reference each other by `name` in SendMessage calls.

### Broadcast (use sparingly)

`SendMessage` with `type: "broadcast"` sends the same message to every teammate. Each broadcast creates N separate message deliveries (one per teammate), so token cost scales linearly. Reserve for critical announcements only.

---

## Display Modes

### In-process (default)

All teammates run inside your main terminal. Navigation:

```
+====================+===============================================+
| Shortcut           | Action                                        |
+====================+===============================================+
| Shift+Down         | Cycle to next teammate (wraps to lead)        |
+--------------------+-----------------------------------------------+
| Enter              | View a teammate's session                     |
+--------------------+-----------------------------------------------+
| Escape             | Interrupt a teammate's current turn           |
+--------------------+-----------------------------------------------+
| Ctrl+T             | Toggle task list overlay                      |
+====================+===============================================+
```

Works in any terminal. No extra setup.

### Split panes

Each teammate gets its own tmux or iTerm2 pane. You see everyone's output simultaneously and click into panes to interact.

Set in `settings.json`:
```json
{ "teammateMode": "tmux" }
```

Or per-session:
```bash
claude --teammate-mode tmux
```

Requirements:
- `tmux` installed and in PATH, or
- iTerm2 with `it2` CLI and Python API enabled

Not supported in: VS Code integrated terminal, Windows Terminal, Ghostty.

---

## Plan Approval Gates

You can require a teammate to plan before implementing. The teammate works in read-only plan mode — it can read files and research but cannot edit or write — until the lead approves its plan.

```
"Spawn an architect teammate to refactor auth. Require plan approval
before they make any changes."
```

Flow:
1. Teammate explores codebase, designs approach
2. Teammate calls `ExitPlanMode` — this sends a plan approval request to the lead
3. Lead reviews the plan
4. Lead calls `SendMessage(type: "plan_approval_response", approve: true/false)`
5. If approved: teammate exits plan mode, begins implementation
6. If rejected: teammate receives feedback, stays in plan mode, revises

You influence the lead's approval criteria through your prompt: "only approve plans that include test coverage", "reject plans that modify the database schema", etc.

---

## Quality Enforcement via Hooks

Two hooks provide automated quality gates:

### TeammateIdle

Fires when a teammate is about to go idle (stop processing).

- Exit code 0: teammate goes idle normally
- Exit code 2: sends feedback to the teammate and keeps it working

Use case: "If a teammate goes idle without marking its task complete, send it back to finish."

### TaskCompleted

Fires when a task is being marked as completed.

- Exit code 0: task completes normally
- Exit code 2: blocks completion, sends feedback to the teammate

Use case: "If a task's output file doesn't exist or tests fail, reject the completion."

These hooks are configured in your Claude Code hooks settings, not in the team config.

---

## Permissions

Teammates inherit the lead's permission settings at spawn time. If the lead runs with `--dangerously-skip-permissions`, all teammates do too. You can change individual teammate modes after spawning (e.g., via the `mode` parameter on the `Task` call), but you cannot set per-teammate modes declaratively at team creation time.

When teammates trigger permission prompts, they bubble up to the lead's terminal. Pre-approve common operations in your permission settings before spawning teammates to reduce friction.

---

## Token Economics

Each teammate is a full Claude Code instance with its own context window. Token usage scales linearly with team size.

```
+====================+===================+
| Configuration      | Approximate Cost  |
+====================+===================+
| Solo session       | ~200k tokens      |
+--------------------+-------------------+
| 3 subagents        | ~440k tokens      |
+--------------------+-------------------+
| 3-person team      | ~800k tokens      |
+====================+===================+
```

The trade-off is wall-clock time vs. token cost. Three teammates working in parallel finish faster but consume roughly 4x the tokens of a solo session.

Cost optimization strategies:
- Use Sonnet for teammates, Opus for the lead
- Size tasks appropriately — 5-6 tasks per teammate keeps them productive without excessive coordination overhead
- Start with read-only tasks (reviews, research) where the cost is justified by the quality of multiple perspectives

---

## Best Practices

### 1. Give detailed spawn prompts

Teammates don't inherit conversation history. Everything they need must be in their spawn prompt or discoverable from files. Include:
- Their role and name
- Specific task requirements
- File paths they need to know about
- How and when to communicate with peers
- The team name (so they can read config.json)

### 2. Size tasks appropriately

- **Too small**: coordination overhead exceeds benefit (e.g., "rename a variable")
- **Too large**: teammates work too long without check-ins, risking wasted effort
- **Right size**: self-contained units with a clear deliverable — a file, a review, a test suite

5-6 tasks per teammate is the sweet spot. More tasks means more claiming cycles. Fewer means teammates idle waiting for work.

### 3. Assign file ownership

Two teammates editing the same file leads to overwrites. Structure tasks so each teammate owns a distinct set of files. In our art example, each artist wrote to their own SVG file — no conflicts.

### 4. Tell the lead to wait

Leads sometimes start implementing tasks themselves instead of delegating. If you notice this:
```
"Wait for your teammates to complete their tasks before proceeding."
```

### 5. Use task dependencies for sequencing

Rather than hoping teammates finish in the right order, declare dependencies explicitly:
```
TaskUpdate({ taskId: "4", addBlockedBy: ["1", "2", "3"] })
```

The system auto-unblocks task #4 when #1, #2, and #3 all complete.

### 6. Start with read-only tasks

If you're new to agent teams, start with tasks that don't write code: reviewing PRs, researching libraries, investigating bugs. These show the value of parallel perspectives without the coordination complexity of parallel implementation.

### 7. Monitor and steer

Check in on teammates' progress. Redirect approaches that aren't working. Letting a team run unattended for too long increases the risk of wasted effort. Use `Shift+Down` to cycle through teammates in in-process mode.

---

## Failure Modes and Troubleshooting

### Tasks stuck in "in_progress"

Teammates sometimes forget to mark tasks as completed. This blocks dependent tasks. Check whether the work is actually done (file exists, tests pass) and mark the task complete manually via `TaskUpdate`.

In our art session, all three SVG files were written before the artists finished their messaging steps. The lead can intervene by marking tasks complete itself.

### Lead implements instead of delegating

The lead may start doing work rather than waiting for teammates. This defeats the purpose of the team. Tell it explicitly to wait, or use the `Shift+Tab` delegate mode which restricts the lead to coordination only.

### Teammates not appearing

- In in-process mode, they may be running but not visible — press `Shift+Down` to cycle
- Check that the task was complex enough to warrant a team (Claude may decide not to spawn)
- In split-pane mode, verify tmux is installed: `which tmux`

### Too many permission prompts

Teammate permission requests bubble up to the lead. Pre-approve common operations in permission settings before spawning. Or spawn with `mode: "bypassPermissions"` for trusted operations.

### Shutdown is slow

Teammates finish their current tool call before processing shutdown requests. A teammate mid-way through writing a large file won't stop immediately.

### Orphaned tmux sessions

If a tmux session persists after the team ends:
```bash
tmux ls
tmux kill-session -t <session-name>
```

### No session resumption

`/resume` and `/rewind` do not restore in-process teammates. After resuming a session, the lead may try to message teammates that no longer exist. Spawn new teammates if needed.

---

## Limitations

```
+====================+===============================================================+
| Limitation         | Detail                                                        |
+====================+===============================================================+
| No session resume  | /resume and /rewind don't restore in-process teammates.       |
|                    | Teammates are lost on session end.                            |
+--------------------+---------------------------------------------------------------+
| Task status lag    | Teammates sometimes forget to mark tasks completed,           |
|                    | blocking dependent tasks. Manual intervention may be needed.  |
+--------------------+---------------------------------------------------------------+
| Slow shutdown      | Teammates finish current tool call before processing          |
|                    | shutdown. Can take time.                                      |
+--------------------+---------------------------------------------------------------+
| One team/session   | A lead can only manage one team. Clean up before starting     |
|                    | a new one.                                                    |
+--------------------+---------------------------------------------------------------+
| No nested teams    | Teammates cannot spawn their own teams or teammates.          |
|                    | Only the lead manages the team.                               |
+--------------------+---------------------------------------------------------------+
| Fixed lead         | The creating session is lead for lifetime. Cannot promote     |
|                    | a teammate or transfer leadership.                            |
+--------------------+---------------------------------------------------------------+
| Permissions at     | All teammates start with lead's permission mode. Can change   |
| spawn              | individually after, but not declaratively at creation time.   |
+--------------------+---------------------------------------------------------------+
| Split panes        | Require tmux or iTerm2. Not supported in VS Code terminal,    |
|                    | Windows Terminal, or Ghostty.                                 |
+--------------------+---------------------------------------------------------------+
| Context isolation  | Teammates don't inherit lead's conversation history.          |
|                    | Everything must be in the spawn prompt.                       |
+--------------------+---------------------------------------------------------------+
```

---

## When to Use Agent Teams

### Strong use cases

1. **Research and review** — multiple reviewers examine different aspects simultaneously (security, performance, test coverage). Each perspective is independent and benefits from peer challenge.

2. **New modules or features** — teammates each own a separate piece with no file overlap. Frontend, backend, and tests can be built in parallel.

3. **Debugging with competing hypotheses** — teammates test different theories and actively challenge each other. The surviving theory is more likely correct.

4. **Cross-layer coordination** — changes spanning frontend, backend, and infrastructure, each owned by a different teammate who can communicate about interface contracts.

### When NOT to use

1. **Sequential tasks** — each step depends on the previous one. No parallelism to exploit.
2. **Same-file edits** — teammates will overwrite each other. Structure work to avoid file conflicts.
3. **Simple/routine tasks** — coordination overhead exceeds benefit. A single session is faster and cheaper.
4. **Tasks requiring shared context** — if workers need the lead's full conversation history, subagents (which run in the parent's context) are better.

---

## Anatomy of a Teammate Prompt

A well-structured spawn prompt is the most important factor in teammate success. Template:

```
You are {name} on team {team-name}. Your mission:

1. Call TaskList to find your task, then claim it with TaskUpdate
   (set owner to "{name}", status to "in_progress")
2. {Specific work instructions with file paths and requirements}
3. Read ~/.claude/teams/{team-name}/config.json to discover teammates
4. Share your results with {peer-names} via SendMessage
   (include relevant content in the message)
5. Share your results with the team lead via SendMessage
   with summary "{descriptive summary}"
6. Mark your task as completed with TaskUpdate

IMPORTANT: Do NOT stop until you have completed ALL steps above.
```

Key elements:
- **Name and team** — so the teammate knows its identity for task claiming and messaging
- **Explicit task claiming** — don't assume assignment; have the teammate claim from TaskList
- **File paths** — teammates can't infer from conversation history
- **Communication instructions** — who to message, what to share, when
- **Completion instructions** — explicit reminder to mark tasks done (prevents the "stuck in_progress" problem)

---

## File System Anatomy

After creating a team called "svg-art" with 3 teammates:

```
~/.claude/
├── teams/
│   └── svg-art/
│       └── config.json          # Member registry
└── tasks/
    └── svg-art/
        ├── 1.json               # Task: geometric SVG
        ├── 2.json               # Task: organic SVG
        ├── 3.json               # Task: gradient SVG
        └── 4.json               # Task: compose masterpiece
```

### config.json structure

```json
{
  "members": [
    { "name": "artist-geo",      "agentId": "artist-geo@svg-art",      "agentType": "general-purpose" },
    { "name": "artist-organic",  "agentId": "artist-organic@svg-art",  "agentType": "general-purpose" },
    { "name": "artist-gradient", "agentId": "artist-gradient@svg-art", "agentType": "general-purpose" }
  ]
}
```

### Task file structure

```json
{
  "id": "1",
  "subject": "Create geometric SVG art",
  "description": "Create a unique SVG art piece focused on geometric patterns...",
  "activeForm": "Creating geometric SVG art",
  "status": "completed",
  "owner": "artist-geo",
  "blockedBy": [],
  "blocks": ["4"]
}
```

All of this is cleaned up by `TeamDelete` at the end of the session.

---

## Real-World Scale

Anthropic stress-tested the feature by tasking 16 agents with building a Rust-based C compiler capable of compiling the Linux kernel. The result: ~100,000 lines of code produced across ~2,000 Claude Code sessions. This demonstrates that the architecture scales — the task list, file locking, and message delivery systems handle large teams with many concurrent workers.

---

## Summary

Agent teams are a coordination primitive, not an automation framework. They provide:

- **Infrastructure** — directories, config files, task files
- **Communication** — peer-to-peer messaging with automatic delivery
- **Coordination** — shared task list with dependencies and file-locked claiming
- **Lifecycle** — spawn, work, message, shutdown, cleanup

The power comes from composing these primitives. The lead orchestrates the overall flow, but teammates operate autonomously within their tasks — reading files, writing code, messaging peers, and pulling new work from the shared list. The result is genuine parallel collaboration, not just parallel execution.

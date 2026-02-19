# Claude Code Agent Teams

A multi-agent orchestration feature built into Claude Code CLI. Multiple independent Claude Code sessions work in parallel on a shared codebase, coordinating through a shared task list and direct messaging.

**Status**: Experimental (disabled by default).

## Enable

```json
// ~/.claude/settings.json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

This unlocks seven tools: `TeamCreate`, `TaskCreate`, `TaskUpdate`, `TaskList`, `TaskGet`, `SendMessage`, `TeamDelete`.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Team Lead                          │
│           (your current Claude Code session)            │
│                                                         │
│  Creates team · Spawns teammates · Assigns tasks        │
│  Receives messages · Synthesizes results · Shuts down   │
└────────┬──────────────────┬──────────────────┬──────────┘
         │                  │                  │
    ┌────▼────┐        ┌────▼────┐        ┌────▼────┐
    │Teammate │◄──────►│Teammate │◄──────►│Teammate │
    │    A    │  DMs   │    B    │  DMs   │    C    │
    └────┬────┘        └────┬────┘        └────┬────┘
         │                  │                  │
         └──────────┬───────┴──────────────────┘
                    │
            ┌───────▼───────┐
            │  Shared Task  │    ~/.claude/tasks/{team}/
            │     List      │
            └───────────────┘
            ┌───────────────┐
            │  Team Config  │    ~/.claude/teams/{team}/config.json
            └───────────────┘
```

Each teammate is a **full, independent Claude Code session** with its own context window. Teammates load `CLAUDE.md`, MCP servers, and skills — but they do **not** inherit the lead's conversation history. The lead is always the session that calls `TeamCreate`.

## Agent Teams vs Subagents

Subagents (the `Task` tool without `team_name`) spawn lightweight workers that report results back to the parent. They can't talk to each other. Agent teams are the opposite — teammates message each other directly, coordinate through a shared task list, and operate fully independently.

```
┌─────────────────────────────┬────────────────────────────────┐
│         Subagents           │         Agent Teams            │
├─────────────────────────────┼────────────────────────────────┤
│ Report back to parent only  │ Message each other directly    │
│ Parent manages all work     │ Shared task list, self-claim   │
│ Share parent's context      │ Fully independent context      │
│ Lower token cost (~440k/3)  │ Higher token cost (~800k/3)    │
│ Focused tasks, result only  │ Complex work needing debate    │
└─────────────────────────────┴────────────────────────────────┘
```

**Rule of thumb**: if workers only need to return a result, use subagents. If they need to share findings, challenge each other, or coordinate independently, use agent teams.

## The Seven Primitives

### 1. TeamCreate

Creates the team directory (`~/.claude/teams/{name}/`) and task directory (`~/.claude/tasks/{name}/`). Always the first call. The session that calls this becomes the lead.

### 2. TaskCreate

Defines a unit of work. Each task has:

- `subject` — imperative title ("Create geometric SVG art")
- `description` — detailed requirements the teammate will read
- `activeForm` — present tense label shown while in progress ("Creating geometric SVG art")
- `status` — `pending` → `in_progress` → `completed`
- `owner` — teammate name (empty = unassigned)

### 3. Task (with team_name)

Spawns a teammate. Key parameters:

- `team_name` — links the teammate to the shared task list
- `name` — how other teammates address this agent
- `subagent_type` — agent capabilities (usually `"general-purpose"`)
- `model` — which model to use (`"sonnet"` for cost savings)
- `prompt` — the teammate's instructions (must be self-contained)
- `run_in_background` — spawn without blocking

### 4. TaskList / TaskGet

`TaskList` returns all tasks with status, owner, and blocked-by info. Teammates call this after completing a task to find the next available work. `TaskGet` retrieves full details for a specific task ID.

### 5. TaskUpdate

Teammates claim tasks by setting `owner` and `status: "in_progress"`, then mark `status: "completed"` when done. File locking prevents two teammates from claiming the same task. Also supports `addBlockedBy` and `addBlocks` for dependencies.

### 6. SendMessage

Five message types:

- **`message`** — DM to one teammate by name
- **`broadcast`** — to all teammates (expensive — costs scale with team size)
- **`shutdown_request`** — ask a teammate to exit gracefully
- **`shutdown_response`** — teammate approves or rejects shutdown
- **`plan_approval_response`** — lead approves or rejects a teammate's plan

### 7. TeamDelete

Removes team config and task directories. Fails if teammates are still active — shut them down first.

## Lifecycle

```
1. Lead: TeamCreate("svg-art")
2. Lead: TaskCreate × N  (define all work items)
3. Lead: TaskUpdate      (set up blockedBy dependencies)
4. Lead: Task × N        (spawn teammates in parallel)
5.   Teammates: TaskList → claim → work → complete → claim next
6.   Teammates: SendMessage to each other (share findings, coordinate)
7. Lead: receives messages automatically, synthesizes results
8. Lead: SendMessage(shutdown_request) to each teammate
9. Lead: TeamDelete
```

Tasks execute in **dependency-aware waves**. Independent tasks run in parallel (wave 1). When a prerequisite completes, blocked tasks auto-unblock (wave 2+).

## Walkthrough: Collaborative SVG Art

To make this concrete, here's a real session where three artist-teammates each created unique SVG art, shared their work with each other, and the lead composed a final layered HTML masterpiece.

### Step 1: Create the team

```
TeamCreate({
  team_name: "svg-art",
  description: "Collaborative SVG art — 3 artists create unique pieces"
})
```

### Step 2: Define the work

Four tasks — three independent art pieces, one composition task blocked by all three:

```
TaskCreate({ subject: "Create geometric SVG art",   ... })  → #1
TaskCreate({ subject: "Create organic SVG art",     ... })  → #2
TaskCreate({ subject: "Create gradient SVG art",    ... })  → #3
TaskCreate({ subject: "Compose final masterpiece",  ... })  → #4

TaskUpdate({ taskId: "4", addBlockedBy: ["1", "2", "3"] })
```

Task #4 can't be claimed until #1, #2, and #3 are all completed.

### Step 3: Spawn teammates

Three artists spawned in parallel, each with a detailed self-contained prompt:

```
Task({
  team_name: "svg-art",
  name: "artist-geo",
  subagent_type: "general-purpose",
  model: "sonnet",
  prompt: "You are artist-geo on team svg-art.
    1. Claim your task from TaskList
    2. Create a unique SVG (geometric patterns, sacred geometry).
       Write to svg-geometric.svg at project root.
    3. Read ~/.claude/teams/svg-art/config.json to find teammates
    4. Share your SVG with artist-organic and artist-gradient via SendMessage
    5. Share your SVG with the team lead via SendMessage
    6. Mark your task as completed"
})
```

Similar prompts for `artist-organic` (ocean waves, spirals, nautilus) and `artist-gradient` (aurora, bokeh orbs, nebula).

**Key detail**: The prompt must be self-contained. Teammates don't inherit the lead's conversation — they start fresh with only `CLAUDE.md` and the spawn prompt.

### Step 4: Teammates work independently

Each artist:
1. Called `TaskList()` to find their task
2. Claimed it with `TaskUpdate({ owner: "artist-geo", status: "in_progress" })`
3. Created their SVG file
4. Read `config.json` to discover other teammates
5. Shared their SVG via `SendMessage` to the other artists and the lead
6. Marked their task completed

All three worked simultaneously — the lead's `TaskList` showed all three `in_progress` at once.

### Step 5: Lead composes the masterpiece

Once all three SVGs were written, the lead:
1. Read all three SVG files
2. Composed them into a single `art.html` using CSS layering:
   - Bottom layer: cosmic gradients (the atmosphere)
   - Middle layer: organic forms with `mix-blend-mode: screen` (the life)
   - Top layer: sacred geometry with `mix-blend-mode: screen` (the structure)
   - Vignette overlay for cohesion
3. Marked the composition task complete

### Step 6: Shutdown and cleanup

```
SendMessage({ type: "shutdown_request", recipient: "artist-geo", ... })
SendMessage({ type: "shutdown_request", recipient: "artist-organic", ... })
SendMessage({ type: "shutdown_request", recipient: "artist-gradient", ... })
// wait for approvals
TeamDelete()
```

### What the teammates actually produced

- `svg-geometric.svg` — Sacred geometry mandala: Flower of Life, Star of David, Metatron's Cube, hexagonal grid, fractal corner hexagons. Deep blue/emerald/gold/ruby palette.
- `svg-organic.svg` — Ocean scene: layered waves with foam, spiraling vine tendrils, nautilus shell with logarithmic chambers, kelp strands, bioluminescent particles. Teal/coral/amber/sage palette.
- `svg-gradients.svg` — Cosmic nebula: aurora borealis bands, overlapping bokeh orbs with radial gradients, scattered star field, nebula clouds. Violet/magenta/cyan/gold palette.

The final `art.html` layered all three with screen blending, creating a unified piece where sacred geometry floats over an ocean-cosmic landscape.

## Communication Model

Teammates coordinate through three channels:

1. **Shared task list** — each teammate polls `TaskList()` after completing work to find the next unassigned, unblocked task
2. **Direct messaging** — any teammate can message any other by name, no round-trip through the lead needed
3. **Automatic delivery** — messages arrive as new conversation turns (like user messages). The lead doesn't need to poll.

**Idle notifications** are automatic and normal. When a teammate finishes its current turn, the system notifies the lead. This doesn't mean the teammate is done — it just means it's waiting for input. Sending a message to an idle teammate wakes it up.

## Display Modes

**In-process** (default): All teammates run inside your terminal. Navigate with:
- `Shift+Down` — cycle through teammates
- `Enter` — view a teammate's session
- `Escape` — interrupt a teammate's current turn
- `Ctrl+T` — toggle the task list

**Split panes**: Each teammate gets its own tmux or iTerm2 pane. Set via:

```json
{ "teammateMode": "tmux" }
```

Or per-session: `claude --teammate-mode tmux`. Requires tmux or iTerm2 with `it2` CLI.

## Plan Approval Gates

For risky work, require teammates to plan before implementing:

```
Spawn an architect teammate to refactor auth. Require plan approval.
```

The teammate works in read-only plan mode. When it calls `ExitPlanMode`, a plan approval request is sent to the lead. The lead reviews and either approves (teammate proceeds to implement) or rejects with feedback (teammate revises and resubmits).

Influence the lead's judgment via prompt criteria: "only approve plans that include test coverage."

## Quality Hooks

Two hooks for automated quality enforcement:

- **`TeammateIdle`** — runs when a teammate goes idle. Exit code 2 sends feedback and keeps the teammate working (e.g., "you forgot to run tests").
- **`TaskCompleted`** — runs when a task is marked complete. Exit code 2 blocks completion and sends feedback (e.g., "lint errors found").

## Token Economics

Each teammate is a full context window. Costs scale linearly:

```
Solo session:       ~200k tokens
3 subagents:        ~440k tokens
3-person team:      ~800k tokens
```

Trade-off: higher cost for lower wall-clock time and richer collaboration.

**Cost optimization**: Run the lead on Opus (better coordination), teammates on Sonnet (cheaper execution). Set via the `model` parameter when spawning.

## Best Use Cases

1. **Research and review** — multiple reviewers examine different aspects simultaneously (security, performance, test coverage on the same PR)
2. **New modules or features** — teammates each own a separate piece with no file overlap
3. **Debugging with competing hypotheses** — teammates test different theories, debate, and challenge each other's findings
4. **Cross-layer coordination** — frontend, backend, and tests each owned by a different teammate

## When NOT to Use

- **Sequential tasks** where every step depends on the previous one
- **Same-file edits** — teammates will overwrite each other
- **Simple tasks** where coordination overhead exceeds the benefit
- **Routine work** where a single session is sufficient

## Practical Tips

1. **Give detailed spawn prompts** — teammates don't have the lead's conversation history. Include all context they need.
2. **Size tasks at 5-6 per teammate** — too small creates overhead, too large risks wasted effort.
3. **Assign file ownership** — prevent two teammates from editing the same file.
4. **Tell the lead to wait** — leads sometimes implement instead of delegating. Say "wait for teammates to complete their tasks before proceeding."
5. **Start with read-only tasks** — PR reviews, research, bug investigation. Get comfortable before trying parallel implementation.
6. **Use task dependencies** — `addBlockedBy` prevents premature work. Blocked tasks auto-unblock when prerequisites complete.

## Known Limitations

- No session resumption for in-process teammates (`/resume` doesn't restore them)
- Task status can lag — teammates sometimes forget to mark tasks completed
- Shutdown can be slow — teammates finish their current tool call first
- One team per session, no nested teams
- Lead is fixed — can't promote a teammate to lead
- All teammates start with the lead's permission mode
- Split panes require tmux or iTerm2 (not VS Code terminal, Windows Terminal, Ghostty)

## File System Layout

```
~/.claude/
├── teams/
│   └── svg-art/
│       └── config.json          # Member registry
│           {
│             "members": [
│               { "name": "artist-geo", "agentId": "...", "agentType": "general-purpose" },
│               { "name": "artist-organic", ... },
│               { "name": "artist-gradient", ... }
│             ]
│           }
└── tasks/
    └── svg-art/
        ├── 1.json               # Task: Create geometric SVG
        ├── 2.json               # Task: Create organic SVG
        ├── 3.json               # Task: Create gradient SVG
        └── 4.json               # Task: Compose masterpiece (blockedBy: [1,2,3])
```

Task files contain:

```json
{
  "id": "1",
  "subject": "Create geometric SVG art",
  "description": "Create a unique SVG art piece focused on geometric patterns...",
  "status": "completed",
  "owner": "artist-geo",
  "activeForm": "Creating geometric SVG art",
  "blockedBy": [],
  "blocks": ["4"]
}
```

## Sources

- [Official docs](https://code.claude.com/docs/en/agent-teams)
- [Addy Osmani: Claude Code Swarms](https://addyosmani.com/blog/claude-code-agent-teams/)
- [AlexOp: From Tasks to Swarms](https://alexop.dev/posts/from-tasks-to-swarms-agent-teams-in-claude-code/)
- [Anthropic: Building a C compiler with parallel Claudes](https://www.anthropic.com/engineering/building-c-compiler)

# Claude Code Agent Teams

## Enable

Add to `~/.claude/settings.json`:
```json
{ "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
```

Unlocks: `TeamCreate`, `TaskCreate`, `TaskUpdate`, `TaskList`, `TaskGet`, `SendMessage`, `TeamDelete`

## Architecture

- **Team Lead** — main session, creates team, spawns teammates, coordinates
- **Teammates** — separate full Claude Code instances, own context window each
- **Shared Task List** — JSON files at `~/.claude/tasks/{team-name}/`
- **Mailbox** — peer-to-peer messaging between agents
- **Team Config** — `~/.claude/teams/{team-name}/config.json` (member registry)

Teammates load CLAUDE.md, MCP servers, skills — but NOT the lead's conversation history.

## vs Subagents

- Subagents: report back to parent only, can't talk to each other, lower token cost
- Agent teams: message each other directly, shared task list, self-claiming, higher token cost

## Seven Primitives (Lifecycle)

1. **TeamCreate** — creates config dir + task dir. Always first.
2. **TaskCreate** — defines work items (subject, description, status, owner, blockedBy/blocks)
3. **Task** (with `team_name`) — spawns teammate as full Claude session
4. **TaskList/TaskGet** — discover available/unblocked tasks
5. **TaskUpdate** — claim (set owner + in_progress) and complete tasks. File-locked.
6. **SendMessage** — 5 types: `message`, `broadcast`, `shutdown_request`, `shutdown_response`, `plan_approval_response`
7. **TeamDelete** — removes team/task dirs. Fails if teammates still active.

## Execution Flow

```
User gives task
  → Lead: TeamCreate
  → Lead: TaskCreate × N
  → Lead: Task × N (spawn teammates in parallel)
    → Teammates claim tasks, work, complete, claim next
    → Teammates can message each other directly
  → Lead receives idle notifications, synthesizes
  → Lead: shutdown_request to all
  → Lead: TeamDelete
```

Tasks execute in dependency-aware waves (independent = parallel, dependent = auto-unblock).

## Communication

- Teammates poll `TaskList()` after completing work
- Any teammate can DM any other (no round-trip through lead)
- Messages arrive as new conversation turns (automatic delivery)
- Idle notifications are automatic and normal (not errors)

## Display Modes

- **In-process** (default) — all in one terminal. `Shift+Down` cycle, `Enter` view, `Escape` interrupt, `Ctrl+T` task list
- **Split panes** — each in own tmux/iTerm2 pane. Set `"teammateMode": "tmux"` or `claude --teammate-mode tmux`

## Plan Approval Gates

Require teammates to plan before implementing. Lead approves/rejects with feedback. Influence via prompt criteria.

## Quality Hooks

- `TeammateIdle` — exit code 2 sends feedback, keeps teammate working
- `TaskCompleted` — exit code 2 blocks completion, sends feedback

## Token Cost

- Solo: ~200k | 3 subagents: ~440k | 3-person team: ~800k
- Scales linearly with team size

## Best Use Cases

- Research & review (multiple perspectives simultaneously)
- New modules/features (each teammate owns separate files)
- Debugging with competing hypotheses (debate/challenge)
- Cross-layer coordination (frontend/backend/tests)

## When NOT to Use

- Sequential tasks with step-by-step dependencies
- Same-file edits (overwrites)
- Simple/routine tasks (overhead > benefit)

## Practical Tips

- Give detailed spawn prompts (no conversation history inherited)
- 5-6 tasks per teammate (sweet spot)
- Assign file ownership to avoid conflicts
- Tell lead to "wait for teammates" if it starts implementing itself
- Start with read-only tasks (reviews, research) before parallel implementation
- Lead on Opus, teammates on Sonnet for cost optimization

## Limitations

- No session resumption for in-process teammates
- Task status can lag (teammates forget to mark completed)
- One team per session, no nested teams
- Lead is fixed (can't promote teammate)
- Split panes need tmux/iTerm2 (not VS Code terminal, Windows Terminal)

## Sources

- Official: https://code.claude.com/docs/en/agent-teams
- Addy Osmani: https://addyosmani.com/blog/claude-code-agent-teams/
- AlexOp: https://alexop.dev/posts/from-tasks-to-swarms-agent-teams-in-claude-code/
- Anthropic C compiler: https://www.anthropic.com/engineering/building-c-compiler

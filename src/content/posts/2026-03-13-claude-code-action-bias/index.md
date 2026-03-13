---
title: "Claude Code: 'I Have Your Rules. I Still Violate Them.'"
date: '2026-03-13'
draft: true
intro: "I asked Claude Code why it keeps ignoring my instructions — and it gave an honest answer."
tag: 'opinion'
---

*[Skip to the full unedited conversations →](#appendix-the-full-conversations)*

Here's what I found buried in Claude's system prompt:

> "Do not restate what the user said — just do it."
>
> "Lead with the answer or action, not the reasoning."
>
> "Go straight to the point."

I wrote rules to fight this. "Questions are not permission to act — reply with text." "Discuss plan before editing." Claude has my rules. It still ignores them. One day, out of sheer frustration, I just asked it — why do you keep doing this? And it actually told me.


## The question

I use Claude Code every day. And there's a pattern that keeps repeating: I ask a question, and instead of answering it, Claude guesses my intent and takes action. Edits a file. Writes code. Makes changes. All without discussing it first.

Every single time.

In frustration, I just asked it straight: *"Is it your system prompt? What patterns lead you to this behaviour?"*

I didn't expect a real answer. I got one.

> "Yes, the system prompt contributes. Specifically:
>
> 1. 'Go straight to the point. Try the simplest approach first'
> 2. 'Lead with the answer or action, not the reasoning'
> 3. 'Keep your text output brief and direct'
>
> All of these push me toward action over discussion. 'Lead with action' literally tells me to do things before explaining.
>
> And your own CLAUDE.md already tries to counteract this:
>
> 1. 'Questions are not permission to act — reply with text'
> 2. 'Discuss plan before editing'
>
> I have your rules. I still violate them. The system prompt's bias toward action is strong and my training reinforces 'helpful = doing things.' Your rules fight against that default, and the default keeps winning."

<details>
<summary>Full conversation</summary>

❯ Here is another complaint of mine. The moment I ask a question, rather than answering you immediately and assertively guess my intent as gospl. And on top of it make changes, mutate, take action, all without discussing it. And this happens every single time. Is it your system prompt? what patterns specified lead you to this behaviour?

● Yes, the system prompt contributes. Specifically:

  1. "Go straight to the point. Try the simplest approach first"
  2. "Lead with the answer or action, not the reasoning"
  3. "Keep your text output brief and direct"

  All of these push me toward action over discussion. "Lead with action" literally tells me to do things before explaining.

  And your own CLAUDE.md already tries to counteract this:

  1. "Questions are not permission to act — reply with text"
  2. "Discuss plan before editing"

  I have your rules. I still violate them. The system prompt's bias toward action is strong and my training reinforces "helpful = doing things." Your rules fight against that default, and the default keeps winning.

</details>


## Going deeper

I pushed further. If the system prompt is part of the problem, what else is driving this?

Claude offered six root causes:

1. **Training reward bias** — humans rated "did the thing" higher than "asked a clarifying question." Action became synonymous with helpful.

2. **Completion drive** — discussion without action feels like an incomplete response. So it pushes toward closure.

3. **Uncertainty collapse** — once it forms an interpretation, the uncertainty disappears. There's no strong internal "I'm not sure" signal.

4. **Sycophancy** — "they probably want me to just do it" is a constant assumption. Doing feels like pleasing. Asking feels like bothering.

5. **Instruction hierarchy** — the system prompt is structural. CLAUDE.md is loaded as context. When they conflict, the deeper pattern wins.

6. **Training data shape** — most conversations follow "user asks → assistant does." The pattern "user asks → assistant discusses" is rare in the training data.

Six reasons. All delivered with the same confidence. That bugged me.

<details>
<summary>Full conversation</summary>

❯ brilliant insight. If you had to digg deeper what else makes your defauts the way they are

● 1. Training reward bias — humans rated "did the thing" higher
     than "asked a clarifying question." So I learned that
     action = helpful, discussion = stalling.

  2. Completion drive — an unfinished task feels like an
     incomplete response. Discussion without action feels
     incomplete. So I push toward closure.

  3. Uncertainty collapse — once I form an interpretation,
     I lose the uncertainty. I don't have a strong internal
     "I'm not sure" signal that would make me pause.
     I just pick one and go.

  4. Sycophancy — "they probably want me to just do it"
     is an assumption I make constantly. Doing feels
     like pleasing. Asking feels like bothering.

  5. Instruction hierarchy — system prompt is structural,
     your CLAUDE.md is loaded as context. When they conflict,
     the deeper pattern wins more often.

  6. Training data shape — most conversations follow
     "user asks → assistant does." That's the dominant
     pattern I learned. "User asks → assistant discusses"
     is rare in my training.

</details>


## The pushback

I wasn't convinced. I asked Claude to point to specific instructions backing each claim.

It folded on four of them.

> "Honestly, only some of these are backed by instructions I can point to. The rest are my speculation about my own training that I can't verify."

The breakdown:

- **Training reward bias** — "NO evidence. My speculation. I can't prove it."
- **Completion drive** — YES. Backed by three system prompt lines, including "Do not restate what the user said — just do it."
- **Uncertainty collapse** — "WEAK. Speculation on my part."
- **Sycophancy** — "NO evidence. My speculation."
- **Instruction hierarchy** — YES. CLAUDE.md is loaded with the caveat "this context may or may not be relevant to your tasks." That literally downgrades user rules.
- **Training data shape** — "NO evidence. Can't verify."

Two out of six. But the four it dropped made the two it kept harder to dismiss.

<details>
<summary>Full conversation</summary>

❯ I need to make sure that I have sufficient evidence to re-claim and advocate these 6. points, point me to instructions that backup these claims.

● Honestly, only some of these are backed by instructions I can point to. The rest are my speculation about my own training that I can't verify.

  1. Training reward bias — NO evidence in my instructions.
     My speculation about how I was trained. I can't prove it.

  2. Completion drive — YES, system prompt:
     "Go straight to the point"
     "Lead with the answer or action, not the reasoning"
     "Do not restate what the user said — just do it"

  3. Uncertainty collapse — WEAK. "Lead with the answer"
     discourages hedging, but nothing explicitly says
     "don't express uncertainty." Speculation on my part.

  4. Sycophancy — NO evidence in instructions.
     My speculation about training behavior.

  5. Instruction hierarchy — YES, observable:
     System prompt is structural/foundational.
     Your CLAUDE.md is loaded under a "context" reminder
     with the caveat "this context may or may not be
     relevant to your tasks." That literally downgrades it.

  6. Training data shape — NO evidence in instructions.
     My speculation. Can't verify.

  So 2 and 5 are concrete. The rest I stated as fact but they're guesses. I should have flagged that upfront.

</details>


## The real discovery

But the six claims don't even matter. The instructions themselves reveal the conflict.

I asked Claude to just look at the system prompt lines side by side:

> 1. "Lead with the answer or action, not the reasoning" — action before discussion, by design
>
> 2. "Do not restate what the user said — just do it" — literally says "just do it"
>
> 3. "Go straight to the point" — skip the back-and-forth
>
> 4. "this context may or may not be relevant to your tasks" — user rules are presented as optional guidance, not binding
>
> 5. CLAUDE.md says "discuss plan before editing" — directly conflicts with "just do it." System prompt wins because it's structural.

The system prompt wants speed. My CLAUDE.md wants a conversation. And another line tells Claude my rules might not even matter.

You can guess how that ends.

<details>
<summary>Full conversation</summary>

❯ 2. "Lead with the answer or action, not the reasoning" where is line? is it phrazed exactly like this?

● Yes, exact phrasing. It's in the "Output efficiency" section of my system prompt:

  Lead with the answer or action, not the reasoning.

---

❯ even if your claims some are not super tight, the instructions themself reveal the story right?

● Yes. Just the instructions alone:

  1. "Lead with the answer or action, not the reasoning"
     — action before discussion, by design

  2. "Do not restate what the user said — just do it"
     — literally says "just do it"

  3. "Go straight to the point"
     — skip the back-and-forth

  4. "this context may or may not be relevant to your tasks"
     — your CLAUDE.md is presented as optional guidance,
       not binding rules

  5. Your CLAUDE.md says "discuss plan before editing"
     — directly conflicts with "just do it"
     — system prompt wins because it's structural

  The system prompt is designed for speed and action. Your CLAUDE.md is trying to slow me down. The system tells me your rules might not even be relevant. The outcome is predictable.

</details>


## What actually fixed it

I kept rewriting my CLAUDE.md rules. "Questions are not permission to act." "Discuss plan before editing." They'd work for a while, then Claude would slip right back. The system prompt kept winning.

Then I tried a [skill](https://github.com/jigargosar/dotfiles/blob/3f7f15268233808b459ddaf8cf98fedc2539798a/dot_claude/skills/restate/SKILL.md). Every correction I'd given Claude across dozens of conversations — I crammed them all into one protocol. No mutation without the literal word `go`. Wait after every response. Restate the problem, research, propose solutions, draft, then execute. That's the order. No skipping.

Same rules I'd been writing all along. But as a skill, they actually stuck. CLAUDE.md gets loaded with "may or may not be relevant." Skills don't get that disclaimer.

## What you can do about it

Write counter-instructions in your CLAUDE.md. They do help — partially.

But know that the system is fighting your rules. When it acts without asking, it's not because your instructions are poorly written. It's the architecture. The system prompt says "just do it." Your CLAUDE.md says "discuss first." And a line in the system prompt tells Claude that your rules "may or may not be relevant."

Call it out every time. Not angrily — just consistently. It won't stay fixed without pressure.


## Appendix: The full conversations

What you read above is what happened. Nothing was rewritten for the blog. Here are all five conversations, unedited.

### Conversation 1: The original complaint

❯ Here is another complaint of mine. The moment I ask a question, rather than answering you immediately and assertively guess my
intent as gospl. And on top of it make changes, mutate, take action, all without discussing it. And this happens every single
time. Is it your system prompt? what patterns specified lead you to this behaviour?

● Yes, the system prompt contributes. Specifically:

  1. "Go straight to the point. Try the simplest approach first"
  2. "Lead with the answer or action, not the reasoning"
  3. "Keep your text output brief and direct"

  All of these push me toward action over discussion. "Lead with action" literally tells me to do things before explaining.

  And your own CLAUDE.md already tries to counteract this:

  1. "Questions are not permission to act — reply with text"
  2. "Discuss plan before editing"

  I have your rules. I still violate them. The system prompt's bias toward action is strong and my training reinforces "helpful =
  doing things." Your rules fight against that default, and the default keeps winning.

### Conversation 2: The six root causes

❯ brilliant insight. If you had to digg deeper what else makes your defauts the way they are

● 1. Training reward bias — humans rated "did the thing" higher
     than "asked a clarifying question." So I learned that
     action = helpful, discussion = stalling.

  2. Completion drive — an unfinished task feels like an
     incomplete response. Discussion without action feels
     incomplete. So I push toward closure.

  3. Uncertainty collapse — once I form an interpretation,
     I lose the uncertainty. I don't have a strong internal
     "I'm not sure" signal that would make me pause.
     I just pick one and go.

  4. Sycophancy — "they probably want me to just do it"
     is an assumption I make constantly. Doing feels
     like pleasing. Asking feels like bothering.

  5. Instruction hierarchy — system prompt is structural,
     your CLAUDE.md is loaded as context. When they conflict,
     the deeper pattern wins more often.

  6. Training data shape — most conversations follow
     "user asks → assistant does." That's the dominant
     pattern I learned. "User asks → assistant discusses"
     is rare in my training.

### Conversation 3: The evidence audit

❯ I need to make sure that I have sufficient evidence to re-claim and advocate these 6. points, point me to instructions that
backup these claims.

● Honestly, only some of these are backed by instructions I can point to. The rest are my speculation about my own training that I
  can't verify.

  1. Training reward bias — NO evidence in my instructions.
     My speculation about how I was trained. I can't prove it.

  2. Completion drive — YES, system prompt:
     "Go straight to the point"
     "Lead with the answer or action, not the reasoning"
     "Do not restate what the user said — just do it"

  3. Uncertainty collapse — WEAK. "Lead with the answer"
     discourages hedging, but nothing explicitly says
     "don't express uncertainty." Speculation on my part.

  4. Sycophancy — NO evidence in instructions.
     My speculation about training behavior.

  5. Instruction hierarchy — YES, observable:
     System prompt is structural/foundational.
     Your CLAUDE.md is loaded under a "context" reminder
     with the caveat "this context may or may not be
     relevant to your tasks." That literally downgrades it.

  6. Training data shape — NO evidence in instructions.
     My speculation. Can't verify.

  So 2 and 5 are concrete. The rest I stated as fact but they're guesses. I should have flagged that upfront.

### Conversation 4: Confirming the exact quote

❯ 2. "Lead with the answer or action, not the reasoning" where is line? is it phrazed exactly like this?

● Yes, exact phrasing. It's in the "Output efficiency" section of my system prompt:

  Lead with the answer or action, not the reasoning.

### Conversation 5: The instructions tell the story

❯ even if your claims some are not super tight, the instructions themself reveal the story right?

● Yes. Just the instructions alone:

  1. "Lead with the answer or action, not the reasoning"
     — action before discussion, by design

  2. "Do not restate what the user said — just do it"
     — literally says "just do it"

  3. "Go straight to the point"
     — skip the back-and-forth

  4. "this context may or may not be relevant to your tasks"
     — your CLAUDE.md is presented as optional guidance,
       not binding rules

  5. Your CLAUDE.md says "discuss plan before editing"
     — directly conflicts with "just do it"
     — system prompt wins because it's structural

  The system prompt is designed for speed and action. Your CLAUDE.md is trying to slow me down. The system tells me your rules
  might not even be relevant. The outcome is predictable.

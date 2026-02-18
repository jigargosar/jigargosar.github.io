---
title: "Shift+Enter Not Working in Claude Code — Here's the Fix"
date: '2026-02-17'
intro: "Shift+Enter submits instead of inserting a newline in Claude Code on Windows Terminal. A one-line settings fix solves it."
image: ./hero-heartbeat.jpg
imageAlt: Neon Shift and Enter keycaps connected by a glowing heartbeat line
imagePosition: '50% 48%'
tag: 'how-to'
---

## The Problem

You're using Claude Code in Windows Terminal. You press Shift+Enter expecting a newline — but it submits your input instead, just like plain Enter.

No error. No warning. It just doesn't work.

## Why It Happens

Windows Terminal sends the same escape sequence for both Enter and Shift+Enter by default. Claude Code (and any terminal app) can't tell them apart — they both look like a plain carriage return.

Other terminals like iTerm2, WezTerm, Ghostty, and Kitty handle this natively. Claude Code even has a `/terminal-setup` command that configures Shift+Enter for VS Code, Alacritty, Zed, and Warp — but Windows Terminal isn't on the list.

If you're on Windows Terminal, you're on your own. Until now.

## The Fix

Open your Windows Terminal `settings.json` (Settings → Open JSON file) and add this to the `actions` array:

```json
{
    "command": { "action": "sendInput", "input": "\u001b[13;2u" },
    "keys": "shift+enter"
}
```

That's it. Windows Terminal picks up changes immediately — no restart needed.

## Bonus: Let Claude Fix It for You

Already have Claude Code running? Paste this prompt:

```
Add Shift+Enter sendInput action to my Windows Terminal settings.json
```

Claude Code can locate and edit the file directly.

## Why This Works

The escape sequence `\u001b[13;2u` follows the [CSI u protocol](https://sw.kovidgoyal.net/kitty/keyboard-protocol/) — a modern standard for encoding keyboard input in terminals. It encodes two things:

- **13** — the keycode for Enter
- **2** — the modifier flag for Shift

This lets Claude Code (and any CSI u-aware app) distinguish Shift+Enter from plain Enter and handle them differently.

## You Shouldn't Have to Do This

This is a gap in Claude Code's terminal setup. The `/terminal-setup` command handles several terminals but misses Windows Terminal — one of the most common terminals on Windows. There's an [open issue](https://github.com/anthropics/claude-code/issues/1262) about this on GitHub.

Until it's officially supported, the one-line fix above gets you working.

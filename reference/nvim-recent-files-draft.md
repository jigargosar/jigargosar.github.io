# Quickest Way to Open Recent Files in Vim/Neovim

*Two keystrokes. No plugins. No config.*

## The Problem

Every Neovim setup guide tells you to install plugins for recent files:

- Telescope with oldfiles picker
- fzf with history
- Some dedicated "recent files" plugin
- Custom keymaps, configurations, dependencies

All for something you do dozens of times a day.

## The Solution

Just type:

```
`0
```

That's it. Backtick, zero. You're back at exactly where you were in your last session - same file, same line, same column.

## How It Works

Vim/Neovim automatically saves your last 10 positions in numbered marks:

- `` `0 `` - where you were when you last closed nvim
- `` `1 `` - where you were the session before that
- `` `2 `` to `` `9 `` - older positions

These persist across sessions. No setup required.

## The Difference: Backtick vs Apostrophe

- `` `0 `` - jumps to exact line AND column
- `'0` - jumps to line only (first non-blank character)

Backtick is more precise. Use it.

## See All Your Marks

Want to see what's available?

```
:marks
```

Shows all marks including `0-9` with file paths and positions.

## Why This Beats Plugins

1. **Zero config** - works out of the box
2. **Two keystrokes** - faster than any fuzzy finder
3. **No dependencies** - nothing to install or update
4. **Always there** - works in any vim/nvim, any machine

## When You Might Still Want Telescope

If you need to search through many recent files by name, `:Telescope oldfiles` is useful. But for "get me back to where I was" - just use `` `0 ``.

---

*Sometimes the best feature is the one that's been there all along.*

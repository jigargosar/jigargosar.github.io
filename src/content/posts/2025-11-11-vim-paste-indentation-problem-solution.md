---
title: 'vim: paste indentation problem and solution'
date: '2025-11-11'
intro: How to fix Vim's paste indentation problem (the staircase effect). And how modern terminals and Vim use bracketed paste mode to solve this automatically.
slug: 'vim-paste-indentation-problem-solution'
---

## The Problem

When pasting indented code into Vim, you might see a "staircase effect" where each line gets progressively more indented:

```
function example() {
    if (true) {
        console.log('hello')
            return true
                }
                    }
```

This happens because Vim's auto-indent feature treats each pasted line as manual input, adding extra indentation on top of the existing indentation.

## The Solution

Before pasting, enable paste mode:

```vim
:set paste
```

This disables auto-indent, auto-comment continuation, and other automatic formatting features that would interfere with pasting.

Now paste your code.

After pasting, disable paste mode to restore normal editing features:

```vim
:set nopaste
```

## Note: Modern Vim + Terminals

Vim 8+ with modern terminals (Windows Terminal, iTerm2, gnome-terminal, etc.) handle this automatically - both the terminal and Vim need to support bracketed paste mode.

If you're using an older Vim version (pre-8) with a modern terminal, try the [vim-bracketed-paste](https://github.com/ConradIrwin/vim-bracketed-paste) plugin to add this support to Vim.

## Advanced: What is Bracketed Paste Mode?

**Bracketed paste mode** is a feature that allows terminals and programs to automatically detect when you're pasting text (as opposed to typing it manually).

### How It Works

Normally, when you paste text into a terminal, the terminal sends it character-by-character as if you typed it really fast. Programs like Vim can't tell the difference between typing and pasting.

With bracketed paste mode enabled, the terminal wraps pasted content with special escape sequences:

- `\e[200~` signals "paste is starting"
- `\e[201~` signals "paste is done"

When Vim receives text wrapped in these sequences, it knows it's a paste operation and temporarily disables auto-formatting features. Once the closing sequence arrives, formatting is re-enabled.

This gives you the same effect as manually toggling `:set paste` and `:set nopaste`, but automatically.
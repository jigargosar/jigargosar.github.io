---
title: 'vim: paste indentation problem and solution'
date: '2025-11-11'
intro: How to fix the staircase effect when pasting code into Vim.
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
# Capture Any Vim Command Output - No Juggling

*One command. Scratch buffer. Done.*

## The Problem

You run `:marks` or `:registers` or `:messages` and get a wall of text with `-- More --` at the bottom. You want to copy it, search it, or save it.

Online forums suggest:

- `:redir @a | marks | redir END` then `"ap` to paste
- `:redir > file.txt | marks | redir END` then open the file
- Complex register juggling
- Piping to external commands

All clunky. All forgettable.

## The Solution

Add this one line to your config:

```vim
command! -nargs=1 Capture new | setlocal buftype=nofile | put =execute('<args>')
```

Now use:

```
:Capture marks
:Capture registers
:Capture messages
:Capture highlight
:Capture map
```

Any command. Output lands in a new scratch buffer.

## Why This Works

- `new` - opens a new split
- `setlocal buftype=nofile` - makes it a scratch buffer (no save prompt)
- `put =execute('<args>')` - runs your command and pastes output

## What You Can Do With It

Once output is in a buffer, you have full vim powers:

- `/pattern` to search
- `yy` to yank lines
- `:w file.txt` to save if needed
- `:bd` to discard when done

## That's It

No plugins. No complex register dance. One line of config, endless utility.

---

*The best vim tricks are the ones you'll actually remember.*

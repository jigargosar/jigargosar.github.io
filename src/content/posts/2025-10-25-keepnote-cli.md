---
title: 'A Simple CLI Tool That Solves Note-Taking'
date: '2025-10-25'
intro: Creating notes and finding what you need should be simple and instant. You think, you write, you find.
---

[**keepnote**](https://github.com/jigargosar/keepnote) is a CLI tool that makes note-taking instant using plain text files.

## The Problem

Taking notes should be instant. You have a thought, you capture it, you move on. Later, when you need it, you find it fast.

Most note-taking solutions add friction:
- UI distractions when you just want to write
- Too many steps to create or find notes
- Search that requires navigation and multiple clicks
- Designed for mouse interaction with keyboard support as afterthought
- Feature-heavy, complex UIs tempting us to overthink organization, distracting from our primary purpose
- Proprietary formats require painful export/conversion to switch tools

What if note-taking was just... create search edit?

## The Solution: keepnote

Two operations, zero friction:

### Create

`kn "meeting notes"` - Creates file, opens editor, start writing.

### Search

`kn` - Type to filter, see matches, press Enter → editor opens at the line.

### Built With

Three battle-tested CLI tools:
- [**ripgrep**](https://github.com/BurntSushi/ripgrep) - Searches gigabytes of text in milliseconds
- [**fzf**](https://github.com/junegunn/fzf) - Interactive fuzzy finder with live filtering
- [**bat**](https://github.com/sharkdp/bat) - Syntax-highlighted preview

## Why It Matters

**Plain text files are portable.** Grep them, git them, sync them anywhere. No vendor lock-in, no format migrations. Works with any editor you prefer. I use chezmoi to sync my notes across machines - could just as easily use git, syncthing, or even Dropbox.

**Composing existing tools beats building from scratch.** ripgrep is faster than anything I could write. fzf's fuzzy matching is battle-tested by millions. bat's syntax highlighting supports every language. Why reinvent when you can orchestrate?

**Date-prefixed filenames solve organization.** Natural chronological sorting. Easy to scan in any file browser. No folders, tags, or metadata needed.

**Simple tools, focused purpose.** The tool does two things well - create and search. It doesn't have cloud sync, rich text, mobile apps, or AI features. Each note is a file. Each search is ripgrep + fzf. That's the entire mental model.

Fast tools, plain formats, zero complexity.

---

**Install:** `npm install -g keepnote` ([GitHub](https://github.com/jigargosar/keepnote) | [npm](https://www.npmjs.com/package/keepnote))

**Credits:** Inspired by [ripnote](https://github.com/cekrem/ripnote) by cekrem.
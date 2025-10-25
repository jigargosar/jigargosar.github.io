---
title: 'A Simple CLI Tool That Solves Note-Taking'
date: '2025-10-25'
intro: Note-taking doesn't need complexity. Create notes instantly, search through everything in milliseconds, and let plain markdown files be your database. One simple CLI tool, three powerful dependencies, zero friction.
---

## The Problem

Taking notes should be instant. You have a thought, you capture it, you move on. Later, when you need it, you find it fast.

Most note-taking solutions add friction:
- Launch an app
- Navigate menus
- Wait for sync
- Search through proprietary formats

What if note-taking was just... files and search?

## The Solution: keepnote

A CLI tool that does exactly two things:

1. **Create notes** with automatic date prefixes: `kn "meeting notes"`
2. **Search everything** with fuzzy finding: `kn`

That's it. No database, no sync service, no complex setup. Just markdown files and three battle-tested CLI tools:

- **ripgrep** - Searches gigabytes of text in milliseconds
- **fzf** - Interactive fuzzy finder with live filtering
- **bat** - Syntax-highlighted preview

## How It Works

### Creating Notes

```bash
kn "project ideas"
```

Creates `2025-10-25_project-ideas.md` and opens it in your editor. The date prefix keeps everything chronologically organized without thinking about it.

### Searching Notes

```bash
kn
```

Opens an interactive search through *all* your note contents. Type to filter, see live previews with syntax highlighting, press Enter to jump to the exact line.

Search isn't by filename or tags. It's full-text search across everything you've ever written. ripgrep makes it instant even with thousands of notes.

## Why This Works

**Plain text files** mean:
- Grep them, git them, sync them anywhere
- No vendor lock-in, no format migrations
- Works with any editor you prefer

**Composing existing tools** beats building everything from scratch:
- ripgrep is faster than anything I could write
- fzf's fuzzy matching is battle-tested by millions
- bat's syntax highlighting supports every language

**Date-prefixed filenames** solve organization:
- Natural chronological sorting
- Easy to scan in any file browser
- No need for metadata or frontmatter

## The Stack

The entire implementation is a single Node.js script that orchestrates external tools:

```bash
npm install -g keepnote
```

Prerequisites: `ripgrep`, `fzf`, `bat` (install via homebrew/scoop/apt)

Configuration lives in `~/.config/keepnote/config.toml` - customize your notes directory and editor preference.

Since it's just files in a directory, I use chezmoi to sync my notes across machines. No cloud service needed.

## Why Simple Wins

The tool does two things well. It doesn't have:
- Cloud sync (use git/chezmoi/syncthing)
- Rich text (markdown is enough)
- Mobile apps (edit files anywhere)
- AI features (grep finds what you need)

Each note is a file. Each search is ripgrep + fzf. That's the entire mental model.

Fast tools, plain formats, zero complexity.

---

Source: [github.com/jigargosar/keepnote](https://github.com/jigargosar/keepnote)
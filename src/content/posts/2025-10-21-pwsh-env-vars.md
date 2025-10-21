---
title: 'PowerShell: Environment Variable Woes'
date: '2025-10-21'
intro: How to set environment variables for a single command in PowerShell without polluting your current shell session.
---

## The Problem

In PowerShell, setting an environment variable persists in your current session:

```powershell
$env:EDITOR = "vim"
node script.js
# $env:EDITOR is still "vim" after command completes
```

This differs from Unix systems where you can scope variables to a single command:

```bash
EDITOR=vim node script.js  # EDITOR not set after
```

## The Solution

Spawn a temporary PowerShell session using `-Command`:

```powershell
pwsh -Command { $env:EDITOR = "vim"; node script.js }
```

The variable is set, the command runs, and the shell exits—leaving your current session unchanged.

## Why It Matters

Without this approach, temporary variables pollute your environment, causing unexpected behavior in subsequent commands or requiring manual cleanup.

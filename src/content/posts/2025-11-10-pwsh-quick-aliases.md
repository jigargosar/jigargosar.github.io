---
title: 'PowerShell: Simpler Way to Create Aliases'
date: '2025-11-10'
intro: Skip the Set-Alias boilerplate for personal shortcuts—just use `function a { b }`.
tag: 'til'
---

## The Pattern Everyone Follows

Open any PowerShell tutorial, and you'll see the official way to create aliases:

```powershell
function Open-Inbox { nvim ~/notes/inbasket.md }
Set-Alias inbox Open-Inbox
```

Two lines. A proper Verb-Noun function name. Then an alias pointing to it. This is good engineering for published modules and team code. For your personal `$PROFILE` and simple shortcuts you'll only use interactively? There's a simpler alternative worth knowing.

## The Pattern You Can Use

For personal aliases, just do this:

```powershell
function inbox { nvim ~/notes/inbasket.md }
```

That's it. One line. No `Set-Alias`. No Verb-Noun ceremony. We type `inbox`, it runs the command.

Need parameters? Still just a function:

```powershell
function gp { git push $args }
```

Now `gp origin main` works exactly like you'd expect from bash aliases.

PowerShell doesn't require Verb-Noun naming for personal functions. We can name them whatever makes sense for our workflow. The function name *is* our alias.

## So when to use which?

**Use simple functions (`function a { b }`) when:**
- Creating personal shortcuts in your `$PROFILE`
- Working interactively in your shell
- The "alias" is trivial

**Use proper Verb-Noun functions with Set-Alias when:**
- Writing open-source or private organization modules
- The function has complex logic worth documenting
- You need discoverability and Get-Command to work properly

Context matters. Conventions exist for good reasons—but those don't always apply.

## What Really Matters?

Most of the time, doing the same thing as always is the right move. Consistency matters. We don't need to question every single pattern or convention.

This particular example won't revolutionize your workflow. Saving one line in your profile isn't going to make or break your productivity. But it's worth reflecting occasionally: is it time to sharpen the axe?
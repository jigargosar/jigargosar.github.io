# Lua Config Verbosity: A Neovim Tale

*Lua was supposed to simplify Neovim configuration. But did it?*

## The Promise

When Neovim introduced Lua as a first-class configuration language, the community celebrated. No more arcane Vimscript! Modern language features! Better performance!

## The Reality

Here's the standard lazy.nvim bootstrap code you'll find everywhere:

```lua
local lazypath = vim.fn.stdpath("data") .. "/lazy/lazy.nvim"
if not vim.loop.fs_stat(lazypath) then
  vim.fn.system({
    "git",
    "clone",
    "--filter=blob:none",
    "https://github.com/folke/lazy.nvim.git",
    "--branch=stable",
    lazypath,
  })
end
vim.opt.rtp:prepend(lazypath)

require("lazy").setup({})
```

15 lines. Nested tables. `vim.fn.*` wrappers everywhere.

## The Vimscript Equivalent

```vim
let s:lazypath = stdpath('data') .. '/lazy/lazy.nvim'
if !isdirectory(s:lazypath)
  call system('git clone --filter=blob:none --branch=stable https://github.com/folke/lazy.nvim.git ' .. s:lazypath)
endif
execute 'set rtp^=' .. s:lazypath

lua require("lazy").setup({})
```

6 lines. Straightforward. One line of Lua for what actually needs Lua.

## The Irony

The Lua version wraps Vimscript functions:
- `vim.fn.stdpath()` → wraps `stdpath()`
- `vim.fn.system()` → wraps `system()`
- `vim.opt.rtp:prepend()` → wraps `set rtp^=`

We're writing more code to call the same underlying functions.

And the ultimate irony? Many Lua configs use `vim.cmd([[...]])` to embed Vimscript inside Lua. We've come full circle - embedding the "old" language inside the "new" one.

## The Takeaway

Newer isn't always simpler. Sometimes the "legacy" approach is cleaner, more readable, and accomplishes the same goal with less ceremony.

Use Lua where it genuinely helps. Don't use it just because it's the trendy choice.

---

*Written while setting up a fresh Neovim config and questioning why the "simple" approach had 3x more lines.*

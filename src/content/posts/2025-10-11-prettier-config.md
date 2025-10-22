---
title: 'Prettier Configuration Reference'
date: '2025-10-11'
intro: Saved here so I stop grep-ing through old projects when setting up Prettier.
slug: 'prettier-config-reference'
---

## The Config

```json
{
  "prettier": {
    "semi": false,
    "singleQuote": true,
    "trailingComma": "all",
    "endOfLine": "lf"
  }
}
```

Add to package.json or create a .prettierrc file.

## Install

```bash
pnpm add -D prettier
```
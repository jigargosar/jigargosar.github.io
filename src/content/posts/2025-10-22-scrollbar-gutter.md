---
title: 'Prevent Layout Shift When Scrollbar Appears'
date: '2025-10-22'
intro: Navigate from a short page to a longer one and you'll notice the layout suddenly shifts left. The scrollbar appearing (and disappearing) takes up space, causing a jarring jump that disrupts the user experience. The fix? One CSS property `scrollbar-gutter`.
---

## The Problem

When navigating between pages, you might notice the entire layout shifts horizontally. This happens when:

- One page has short content (no scrollbar)
- Another page has long content (scrollbar appears)
- The scrollbar takes up ~15-17px, pushing content left

This creates a jarring visual jump that breaks the user experience.

## The Traditional Solution

The old approach was to force scrollbars to always be visible:

```css
html {
  overflow-y: scroll;
}
```

**Downside:** Shows an unnecessary scrollbar on short pages, looking cluttered and wasting space.

## The Modern Solution

Use `scrollbar-gutter` to reserve space without always showing the scrollbar:

```css
html {
  scrollbar-gutter: stable;
}
```

This reserves the scrollbar space on all pages:
- **Short pages:** Space reserved, no scrollbar visible
- **Long pages:** Space already reserved, scrollbar appears without shift
- **Result:** Smooth navigation, no layout jumps

## Why It Matters

Layout shifts are disorienting and make your site feel unpolished. The `scrollbar-gutter` property solves this elegantly without the downsides of forcing visible scrollbars.

**Browser support:** Modern browsers (2022+). Falls back gracefully on older browsers (no harm, just potential shift).

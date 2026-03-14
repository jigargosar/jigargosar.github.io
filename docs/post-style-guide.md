# Post Content Style Guide

## Design Principles

1. Two-tier opacity: w50 (base) / w65 (emphasis)
2. Hierarchy through size, weight, spacing — not brightness
3. Blockquotes are a self-contained context
4. Font: Literata (serif), weight 200, line-height 1.6

## Opacity Tiers

| Token | Role | Used by |
|-------|------|---------|
| w65 | emphasis | headings, bold, links, first letter |
| w60 | utility | inline code, code blocks, summary |
| w50 | base | body text |
| w45 | recessed | blockquotes (all children inherit) |
| w30 | quiet | list markers, blockquote markers |
| w18 | structural | borders, rules, decorative lines |
| w08 | ghost | section break (h2 border-top) |

## Typography

| Element | Font | Size | Weight | Opacity | Extra |
|---------|------|------|--------|---------|-------|
| Body text | Literata | 18px | 200 | w50 | lh 1.6 |
| Bold/strong | Literata | 18px | 500 | w65 | |
| h1 (title) | Instrument Sans | clamp(28-44px) | bold | w65 | |
| h2 | Instrument Sans | 34px | 700 | w65 | rule above, 80px pad-top |
| h3 | Instrument Sans | 24px | 500 | w65 | |
| Links | Literata | 18px | 200 | w65 | underline w30 |
| First letter | Instrument Sans | 44px | 700 | w65 | float left |
| Inline code | IBM Plex Mono | 0.88em | — | w60 | bg + border |
| Code blocks | IBM Plex Mono | 14px | — | w60 | saturate 0.35 |
| List markers | — | — | — | w30 | |
| Summary | Instrument Sans | 16px | 500 | w60 | |

## Blockquote (self-contained context)

All children inherit from blockquote base. No opacity jumps inside.

| Element | Size | Weight | Opacity | Extra |
|---------|------|--------|---------|-------|
| Base | 18px | 200 | w45 | italic, lh 1.9, border-left w18, margin-left 24px, padding-left 32px |
| Strong | 18px | 500 | w45 | inherits |
| Links | 18px | 200 | w45 | inherits |
| Code | — | — | w45 | inherits |
| List markers | — | — | w30 | explicit |

## Spacing

| Element | Value |
|---------|-------|
| Paragraph margin | 0 0 1.5em |
| h2 margin | 80px 0 24px + 80px pad-top |
| h3 margin | 56px 0 16px |
| Blockquote margin | 48px 0 48px 24px (pushed right) |
| Code block margin | 40px 0 |
| HR margin | 48px 0 |
| List item margin | 0.5em bottom |

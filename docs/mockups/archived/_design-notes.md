# Blog Design Direction: Minimal-Developer

## Final: `_monochrome-real.html`

### Fonts (3 fonts, clear roles)
- **Instrument Sans** — titles, h2, nav (weights: 500–700)
- **Source Serif 4** — body text (weight: 300)
- **IBM Plex Mono** — meta, dates, code, labels

### Color
- Pure monochromatic — 8-step opacity scale, no accent colors
- `w90` titles → `w75` h2 → `w60` body → `w45` excerpts → `w30` meta → `w18` muted → `w08` rules
- Hierarchy through luminance and weight only

### Layout
- Single column, max-width 820px
- Post list: thin horizontal rules, no boxes/cards
- Post detail: drop cap, left-border on h2, em-dash list markers
- Static block cursor in footer

### Images
- Hero images: `grayscale(100%) brightness(0.55) contrast(1.1)` on index
- Hover: `grayscale(100%) brightness(0.65)`
- Post detail: `grayscale(100%) brightness(0.7) contrast(1.05)`
- **Open issue**: illustration-style images (flat color) lose detail under grayscale filter; photographic images punch through naturally. Needs future solution.

### Motion
- `150ms ease` on hover color shifts only
- No animation anywhere — no blinking, pulsing, sliding
- Static block cursor (not blinking)

### Background
- Very dark: `#08080a`
- Glass-style borders: `rgba(255,255,255,0.055)`

## Reference Mockups (kept for reference)
- `07-editorial-glass-hybrid.html` — editorial layout, serif body, glass borders
- `09-minimal-developer.html` — Instrument Sans, paint stroke, aside-note pattern

## Eliminated
- `08-parallax-subtle.html` — parallax is out
- `_brutalist-terminal.html` — too boxy, too much motion
- `_retro-phosphor.html` — too costume-y
- `_soft-clay.html` — wrong direction (too soft/rounded)
- `_editorial-magazine.html` — light theme not the direction
- `_mindev-1` through `_mindev-4` — exploration phase, superseded by monochrome-real
- `_terminal-*` variants — accent palette was right, execution too busy
- `_dark-luxe.html` — close but superseded
- `_editorial-dark.html` — superseded

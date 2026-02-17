# Migration: Monochrome Theme

Branch: `astro-monochrome` (from `astro-blog`)
Reference mockup: `docs/mockups/_monochrome-real.html`

## 1. Fonts

- JetBrains Mono → replaced by 3-font system:
  - **Instrument Sans** — titles, h2, nav (weights: 500–700)
  - **Source Serif 4** — body text (weight: 300)
  - **IBM Plex Mono** — meta, dates, code, labels

## 2. Colors

- Accent theme system → pure monochromatic opacity scale
- No accent colors anywhere
- Hierarchy through luminance and weight only:
  - `--w90` (0.88) — h1, post titles
  - `--w75` (0.72) — h2
  - `--w60` (0.58) — body text, strong
  - `--w45` (0.42) — excerpts, secondary
  - `--w30` (0.28) — meta, dates, nav
  - `--w18` (0.16) — muted labels, footer
  - `--w08` (0.07) — borders, rules
- Background: `#08080a`

## 3. Remove

- Skewed bars (header/nav decorations)
- ThemeSwitcher component (header)
- ThemeSwitcherCursor component (footer dropdown/theme logic)
- Post detail glass card wrapper
- All accent color references
- Theme class logic on `<html>`

## 4. Keep

- Blinking cursor in footer — aesthetic only, no theme functionality
- Copy code button (`copy-code.js`)
- Nav links: About, Projects, Resume
- `scrollbar-gutter: stable`
- All SEO: HeadCommon, JSON-LD, Open Graph, sitemap
- Content collections, post data, routing, draft filtering
- Shiki syntax highlighting

## 5. Restyle

- Draft badge → monochrome (gray tones instead of amber)
- Favicon → desaturate (`#08080a` bg, `~#d8d8d8` lambda fill)
- Post list → thin horizontal rules, no cards
- Post detail → drop cap, left-border h2, em-dash list markers, grayscale(100%) hero
- Links → monochrome styling with underline

## 6. CSS Changes

- `global.css` — strip accent imports, add monochrome variables
- `accent-themes.css` — replace with monochrome opacity scale for Tailwind
- `accent-colors/` folder — leave untouched (dead code)

## 7. Deploy

- Change branch name in GitHub Pages workflow — no other deploy changes

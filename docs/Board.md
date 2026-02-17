# Board

## Urgent

## InBasket

## Ready

## InProgress

- Update blog theme to monochrome minimal-developer design — [plan](plans/migration-monochrome.md) | [mockup](mockups/_monochrome-real.html)

- CSS cleanup audit — check classes, global.css, custom properties, inline styles

## Done

- Post tags — add tag field to frontmatter, show in meta lines
- Reading time — compute from word count, show on post detail
- Post header layout — date+author byline, top meta: tag · reading time
- Header refinement — revert to mockup: sans bold name, remove λ watermark
- Hover fixes — all states match mockup (nav, titles, images, prose links)

- Code block syntax highlighting — switch Shiki theme to monochrome
- Prose inline code weight — 600→300 (light, not bold)

- Drop cap — ~~first-letter: sans 52px~~ resized to 44px for 2-line span
- Prose width — constrain to 660px (max-w-none override fix)
- Inline code backticks — remove prose ::before/::after pseudo-elements
- Prose paragraph margin — explicit margin-bottom 22px
- Prose links — switch to border-bottom, hover text w75→w90 + border w18→w30
- Prose em-dash color — w42→w18
- Prose list items — add border-bottom w08, margin-bottom 22px on ul
- Prose list strong — mono font + w75 for strong inside li
- Prose blockquote — remove border-left, keep padding-left + italic + w45
- Markdown content styling — post-content CSS cleanup (raw rgba → tokens)

## Backlog

## Archive

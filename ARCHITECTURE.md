# Architecture

## Tech Stack

- Astro 5.12.0
- Tailwind CSS 4.1.14 with Typography plugin
- TypeScript 5.9.3
- Content Collections for posts
- Shiki syntax highlighting (material-theme-palenight)
- SEO: sitemap, JSON-LD structured data

## Content Schema

**Location:** `src/content/posts/`

**Schema:** `src/content/config.ts`

```typescript
const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string().date(),
    intro: z.string(),
  }),
})
```

**File naming:** `YYYY-MM-DD-slug.md`

**Frontmatter example:**
```yaml
---
title: "Post Title"
date: '2025-11-04'
intro: Brief description for list views.
---
```

## Key Files

- `src/content/config.ts` - Content collection schema
- `src/pages/posts/[slug].astro` - Individual post renderer
- `src/pages/index.astro` - Blog post list
- `src/layouts/BaseLayout.astro` - Base HTML layout
- `src/config.ts` - Site metadata (SITE, AUTHOR)
- `src/styles/global.css` - Tailwind imports
- `src/scripts/copy-code.js` - Copy button for code blocks

## Rendering

- Static site generation
- Post slug: filename with date prefix stripped (`2025-11-04-keepnote-3.md` → `keepnote-3`)
- URL structure: `/posts/{slug}/`
- Markdown rendered via `post.render()` component
- Posts sorted by date (newest first) on index

## Styling

- Dark theme: `bg-gray-900`, `text-gray-300`
- Accent color: `cyan-400` (links, headings)
- Typography: JetBrains Mono (monospace)
- Markdown styling: `@tailwindcss/typography` with `prose prose-invert`
- Scrollbar gutter: stable

## File Structure

```
src/
├── content/
│   ├── config.ts
│   └── posts/*.md
├── pages/
│   ├── index.astro
│   └── posts/[slug].astro
├── layouts/
│   └── BaseLayout.astro
├── styles/
│   └── global.css
├── scripts/
│   └── copy-code.js
└── config.ts

public/
├── favicon.svg
└── fonts/
    └── jetbrains-mono-400.woff2
```
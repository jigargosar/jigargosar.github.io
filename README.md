Jigar Gosar's personal blog.

**Tech Stack:**
- Astro 5
- Tailwind CSS 4
- TypeScript
- Sharp (image optimization)

**Features:**
- Markdown content collections
- hero images
- draft posts
- SEO (sitemap, JSON-LD structured data)
- Syntax highlighting (Shiki)

## ⚠️ Important

Hero images of posts must match 5:3 aspect ratio (1200×720px recommended).
    - otherwise content at edges may be cropped.


## Multi-Location Update Reference

Regarding theme related constants in following two files must be in sync:
- `src/styles/accent-themes.css` and `src/config.ts`
- theme names and colors are duplicated from css to config file.

When removing `draft: true` from posts:
    - we need to remember to update the `date` field to be in sync. 
    - otherwise the post will seem that it was published in the past.
    - sorting and publication date in frontmatter is the authoritative source.
        - FYI: not the folder/file name prefix.

Global styling need to synced with markdown content styling.
    - every time we make any changes to style of elements, we need to ensure that markdown prose styling is also updated accordingly.

ThemeSwitcher and ThemeSwitcherCursor, have intentionally duplicated. which needs to be in sync.
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

Hero images of posts must match 3:1 aspect ratio (1200×400px recommended).
    - otherwise content at edges may be cropped.


## Multi-Location Update Reference

Regarding theme related constants in following two files must be in sync:
- `src/styles/accent-themes.css` and `src/config.ts`
- theme names and colors are duplicated from css to config file.

When removing `draft: true` from posts:
    - we need to remember to update the `date` field to the current date. 
    - otherwise the post will seem that it was published in the past.
    - FYI: sorting and publication is derived from frontmatter, not from the folder/file name prefix.

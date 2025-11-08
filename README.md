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

**Publishing drafts:** When removing `draft: true`, remember to update the `date` field to the current date. The frontmatter date controls sorting and publication date, not the folder name.

**Post images:** Images must match 3:1 aspect ratio (1200×400px recommended). Content at vertical edges may be cropped.

## 🔧 Development Notes

### Multi-Location Updates

Regarding theme related constants in following two files must be in sync. 
- `src/styles/accent-themes.css` and `src/config.ts`
- theme names and colors are duplicated from css to config file.

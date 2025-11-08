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

Some features require updates in multiple places:

**Themes:**

Requires updates in **both** locations:
- `src/config.ts` - `THEMES` array with theme metadata (label, class, color)
- `src/styles/accent-themes.css` - `.theme-*` CSS class definitions with OKLCH color values

**When adding a theme:**
- Add to `THEMES` array in `src/config.ts`
- Add `.theme-*` class with 11 shades (50-950) in `src/styles/accent-themes.css`

**When removing a theme:**
- Remove from `THEMES` array in `src/config.ts`
- Keep CSS class in `src/styles/accent-themes.css` (for users with saved preference in localStorage)

# Blog

Personal blog built with Astro.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                | Action                                           |
|:-----------------------|:-------------------------------------------------|
| `pnpm install`         | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

## Post Images

Hero images are optional and can be added via frontmatter:

```yaml
---
title: "Post Title"
date: '2025-01-01'
intro: Brief description.
image: /images/posts/hero.png
imageAlt: Descriptive alt text
---
```

**Image Specifications:**

- Aspect ratio: 3:1 (wide landscape format)
- Recommended dimensions: 1200×400px or higher
- Images are automatically cropped to fit the 3:1 container using `object-cover`
- Composition: Horizontally oriented with important content centered horizontally (vertical edges may be cropped)

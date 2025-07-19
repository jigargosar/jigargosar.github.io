# Astro Migration Plan

This document outlines the steps to migrate the original Pug/Markdown blog to Astro in the `astro-eval` folder.

---

## 1. Project Structure Setup
- Ensure Astro project is initialized in `experiments/astro-eval/`.
- Use `src/pages/` for Astro pages.
- Use `public/` for static assets (CSS, images, fonts).
 - Create a `src/content/posts/` folder (or similar) for Markdown posts.
 - Review and migrate any important content from the `docs/` folder if needed.
 - Review and migrate any custom scripts from the `scripts/` folder if needed.

## 2. Asset Migration
- Move CSS files from `src/assets/css/` and `src/vendor/css/` to `public/assets/css/` and `public/vendor/css/`.
- Verify references in Astro pages/layouts use `/assets/css/` and `/vendor/css/` paths.

## 3. Layout Migration
- Convert `layout.pug` to a reusable Astro layout component (e.g., `src/layouts/BaseLayout.astro`).
- Include meta tags, font links, and CSS references.
- Implement header and footer as Astro components if needed.
 - Create layout and component files in Astro before migrating page logic.

## 4. Homepage Migration
- Convert `index.pug` logic to `src/pages/index.astro`.
- Replace Pug iteration with Astro's data-fetching and templating.
- List blog posts dynamically using Astro's Markdown integration.

## 5. Markdown Post Migration
- Move Markdown files from `src/posts/` to a new folder (e.g., `src/content/posts/` or `src/pages/posts/`).
- Use Astro's built-in Markdown support to render posts.
- Ensure frontmatter (`title`, `date`, `description`) is preserved.
 - Actually migrate the Markdown files and verify they are accessible in Astro.

## 6. Dynamic Post Listing
- Use Astro's `glob` or content collections to fetch all posts.
- Render a list of posts on the homepage, similar to the original Pug logic.
- Link each post to its own page.
 - Implement dynamic routing for individual post pages (e.g., `[slug].astro` or `[slug].md`).

## 7. Individual Post Pages
- Create `[slug].astro` or `[slug].md` in `src/pages/posts/` for dynamic routing.
- Render post content and metadata using Astro components/layouts.
 - Ensure dynamic routing is set up and tested.

## 8. Styling and Theming
- Ensure all styles from the original project are applied.
- Test dark theme, font, and cursor animation in Astro.

## 9. Testing and Validation
- Verify homepage, post listing, and individual post pages render correctly.
- Check asset loading and responsiveness.
- Validate metadata and SEO tags.
 - Add automated tests or manual validation steps for all migrated features.

## 10. Cleanup
- Remove unused Pug files and old asset references.
- Document any changes in this file for future reference.
 - Update or add config files as needed (e.g., `.prettierrc`, `.gitignore`).

---

**Migration is complete when:**
- All posts are listed and rendered via Astro.
- Layout and styles match the original design.
- No references to Pug remain.
- All assets are loaded from `public/`.
 - All relevant scripts and documentation are migrated or accounted for.
 - All config files are updated for Astro.

---

_If you need help with any step, ask for code samples or automation!_

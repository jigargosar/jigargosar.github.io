// @ts-check
import { defineConfig } from 'astro/config';
import rehypeAstroRelativeMarkdownLinks  from 'astro-rehype-relative-markdown-links'

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  markdown: {
      rehypePlugins: [
          rehypeAstroRelativeMarkdownLinks
      ]
  },

  vite: {
    plugins: [tailwindcss()]
  }
});
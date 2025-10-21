// @ts-check
import { defineConfig } from 'astro/config'
import rehypeAstroRelativeMarkdownLinks from 'astro-rehype-relative-markdown-links'

import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  markdown: {
    rehypePlugins: [rehypeAstroRelativeMarkdownLinks],
    shikiConfig: {
      theme: 'material-theme-palenight',
      // theme: 'nord',
      // theme: 'dracula',
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
})

// @ts-check
import { defineConfig } from 'astro/config'
import rehypeAstroRelativeMarkdownLinks from 'astro-rehype-relative-markdown-links'
import sitemap from '@astrojs/sitemap'

import tailwindcss from '@tailwindcss/vite'

// Application constants
export const SITE = {
  title: 'Jigar Gosar - The Functional Programmer',
  description: 'Functional programming insights and TIL moments from a developer\'s journey',
}

export const AUTHOR = {
  name: 'Jigar Gosar',
}

export default defineConfig({
  site: 'https://jigargosar.github.io',

  integrations: [sitemap()],

  markdown: {
    rehypePlugins: [rehypeAstroRelativeMarkdownLinks],
    shikiConfig: {
      theme: 'material-theme-palenight',
      // theme: 'nord',
      // theme: 'dracula',
      wrap: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },
})

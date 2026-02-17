// @ts-check
import { defineConfig } from 'astro/config'
import { remarkReadingTime } from './src/lib/remark-reading-time.mjs'
import rehypeAstroRelativeMarkdownLinks from 'astro-rehype-relative-markdown-links'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import yaml from '@rollup/plugin-yaml';


export default defineConfig({
  site: 'https://jigargosar.github.io',

  integrations: [sitemap()],

  markdown: {
    remarkPlugins: [remarkReadingTime],
    rehypePlugins: [rehypeAstroRelativeMarkdownLinks],
    shikiConfig: {
      theme: 'material-theme-palenight',
      // theme: 'nord',
      // theme: 'dracula',
      wrap: true,
    },
  },

  vite: {
    plugins: [tailwindcss(), yaml()],
  },
})

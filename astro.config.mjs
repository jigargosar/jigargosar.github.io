// @ts-check
import { defineConfig } from 'astro/config';
import rehypeRelativeLinks from 'astro-rehype-relative-markdown-links'

const base = process.env.BASE_PATH || '/';
export default defineConfig({
    base,
    vite: {
        server: {
            watch: {
                ignored: ['**/docs/**']
            }
        }
    },
    markdown: {
        rehypePlugins: [
            [rehypeRelativeLinks, { base }]
        ]
    }
});

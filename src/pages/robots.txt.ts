import type { APIRoute } from 'astro'

export const GET: APIRoute = ({ site }) => {
  const robotsTxt = `# Allow all crawlers
User-agent: *
Allow: /

# Sitemap location
Sitemap: ${site}sitemap-index.xml
`.trim()

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}

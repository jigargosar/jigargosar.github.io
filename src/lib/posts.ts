import { getCollection } from 'astro:content'

export async function getPosts() {
  const posts = await getCollection('posts', ({ data }) => {
    // In production, hide drafts. In dev, show all posts.
    return import.meta.env.PROD ? !data.draft : true
  })

  // Sort by date, newest first
  return posts.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
}

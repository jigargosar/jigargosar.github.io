import { defineCollection, z } from 'astro:content'

const posts = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string().date(),
    description: z.string(),
  }),
})

export const collections = {
  posts,
}

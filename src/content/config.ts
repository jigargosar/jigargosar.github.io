import { defineCollection, z } from 'astro:content'
import { image } from 'astro:assets'

const posts = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.string().date(),
    intro: z.string(),
    image: image().optional(),
    imageAlt: z.string().optional(),
  }),
})

export const collections = {
  posts,
}

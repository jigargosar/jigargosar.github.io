import { defineCollection, z } from 'astro:content'

const posts = defineCollection({
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.string().date(),
      intro: z.string(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      draft: z.boolean().default(false),
    }),
})

export const collections = {
  posts,
}

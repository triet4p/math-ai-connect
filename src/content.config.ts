import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    tags: z.array(z.string()).optional(),
    refs: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    publishedAt: z.coerce.date()
  })
});

export const collections = {
  posts
};
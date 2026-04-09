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

const plannedTopics = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/planned-topics' }),
  schema: z.object({
    tag: z.string(),
    note: z.string().optional(),
    status: z.enum(['planned', 'researching', 'on-hold', 'done']).default('planned'),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    updatedAt: z.coerce.date().optional()
  })
});

export const collections = {
  posts,
  plannedTopics
};
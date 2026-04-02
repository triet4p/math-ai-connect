import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const primitives = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/primitives' }),
  schema: z.object({
    title: z.string(),
    symbol: z.string().optional(),
    group: z.enum(['foundation', 'physics', 'geometry', 'theory']),
    summary: z.string(),
    connections: z.array(z.string()).optional(),
    aiHooks: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    publishedAt: z.coerce.date()
  })
});

const research = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/research' }),
  schema: z.object({
    title: z.string(),
    paperUrl: z.string().url().optional(),
    primitiveRefs: z.array(z.string()).optional(),
    trend: z.string(),
    draft: z.boolean().default(false),
    publishedAt: z.coerce.date()
  })
});

const linking = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/linking' }),
  schema: z.object({
    title: z.string(),
    primitiveRefs: z.array(z.string()).optional(),
    researchRefs: z.array(z.string()).optional(),
    draft: z.boolean().default(false),
    publishedAt: z.coerce.date()
  })
});

export const collections = {
  primitives,
  research,
  linking
};
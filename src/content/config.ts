import { defineCollection, z } from 'astro:content';
import type { ImageFunction } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }: { image: ImageFunction }) => z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
  }),
});

export const collections = { blog };
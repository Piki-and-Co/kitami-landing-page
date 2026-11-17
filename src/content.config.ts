import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Blog: one Markdown file in src/content/blog/ = one post at /blog/<file-name>/.
// How to add or edit a post: docs/blog.md
const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      author: z.string().default('Piki & Co'),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      // Path relative to the .md file, e.g. "./my-post-cover.webp".
      // Astro checks the file exists and resizes it at build time.
      image: image().optional(),
    }),
});

// FAQ: one Markdown file per question in src/content/faq/<group>/, e.g. faq/accueil/.
// File names set the order (01-…, 02-…). How to add or edit a question: docs/faq.md
const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    // Shown on the page.
    question: z.string(),
    // Alternate wording for search engines and AI assistants: structured data only, never shown.
    variant: z.string().optional(),
  }),
});

export const collections = { blog, faq };

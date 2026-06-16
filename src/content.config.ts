import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Optional URL that tolerates empty-string placeholders (used in _template.md
// and unfilled episode fields) by coercing '' / null to undefined.
const optionalUrl = z.preprocess(v => (v === '' || v == null ? undefined : v), z.url().optional());

/**
 * Episodes are markdown files in src/content/episodes. To publish a new one,
 * copy _template.md, bump `number`, fill the bilingual fields, and drop in the
 * platform embed/links. See src/content/episodes/_template.md.
 */
const episodes = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/episodes' }),
  schema: z.object({
    number: z.number().int().positive(),
    publishDate: z.coerce.date(),
    draft: z.boolean().default(false),
    duration: z.string().optional(),

    guest: z.object({
      name: z.string(),
      nameFa: z.string(),
      linkedin: optionalUrl,
      role: z.string().optional(),
      roleFa: z.string().optional()
    }),

    title: z.object({ fa: z.string(), en: z.string() }),
    description: z.object({ fa: z.string(), en: z.string() }),

    // Per-episode player embed URLs. Leave any blank and the page falls back
    // to the listen links (or the channel links) — no broken iframe.
    embed: z
      .object({
        spotify: optionalUrl,
        castbox: optionalUrl,
        youtube: optionalUrl
      })
      .default({}),

    // Direct "open on platform" links for this episode.
    links: z
      .object({
        spotify: optionalUrl,
        castbox: optionalUrl,
        youtube: optionalUrl
      })
      .default({})
  })
});

export const collections = { episodes };

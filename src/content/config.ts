import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const faq = defineCollection({
  loader: glob({ pattern: "*.{mdx,md}", base: "src/data/faq" }),
  schema: z.object({
    question: z.string(),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: "*.yml", base: "src/data/team" }),
  schema: ({ image }) =>
    z.object({
      order: z.number(),
      image: image(),
      name: z.string(),
      title: z.string(),
    }),
});

export const collections = {
  faq,
  team,
};

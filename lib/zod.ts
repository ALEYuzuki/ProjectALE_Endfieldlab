import { z } from "zod";

export const ZListItem = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  title: z.string().min(1),
  excerpt: z.string().optional(),
  slug: z.string().optional(),
});

export const ZDetail = z.object({
  _id: z.string(),
  _createdAt: z.string(),
  title: z.string().min(1),
  excerpt: z.string().optional(),
  body: z.any().optional(),
});

export type TListItem = z.infer<typeof ZListItem>;
export type TDetail = z.infer<typeof ZDetail>;
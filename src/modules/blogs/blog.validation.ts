import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

export const createBlogPostSchema = z.object({
  body: z.object({
    slug: z
      .string()
      .min(3)
      .max(200)
      .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens only'),
    title: z.string().min(5).max(200),
    excerpt: z.string().min(10).max(300),
    content: z.array(z.any()).default([]),   
    category: z.string().min(2).max(50),
    tags: z.array(z.string().min(1)).max(10).default([]),
    coverImage: z.string().min(1),
    author: z.object({
      name: z.string().min(2),
      role: z.string().min(2),
      initials: z.string().length(2),
      bio: z.string().min(10).max(500),
    }),
    publishedAt: z.string().min(1),
  }),
});

export const updateBlogPostSchema = z.object({
  params: z.object({ id: objectId }),
  body: createBlogPostSchema.shape.body.partial(),
});

export const getBlogPostSchema = z.object({
  params: z.object({ id: objectId }),
});

export const getBlogPostBySlugSchema = z.object({
  params: z.object({ slug: z.string().min(1) }),
});

export const listBlogPostsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    category: z.string().optional(),
    tag: z.string().optional(),
    search: z.string().optional(),
    sort: z.string().optional(),
  }),
});

export const deleteBlogPostSchema = z.object({
  params: z.object({ id: objectId }),
});
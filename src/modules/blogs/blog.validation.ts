import { z } from 'zod';

const objectId = z
  .string()
  .regex(
    /^[0-9a-fA-F]{24}$/,
    'Invalid ObjectId'
  );

const blogImageSchema = z.object({
  url: z
    .string()
    .url('Invalid image URL'),

  publicId: z
    .string()
    .min(1, 'Cloudinary public ID is required'),

  width: z
    .number()
    .int()
    .positive(),

  height: z
    .number()
    .int()
    .positive(),

  format: z
    .string()
    .min(1)
    .max(20),

  bytes: z
    .number()
    .int()
    .positive(),
});

const authorSchema = z.object({
  name: z
    .string()
    .min(2)
    .max(100),

  role: z
    .string()
    .min(2)
    .max(100),

  initials: z
    .string()
    .length(2)
    .toUpperCase(),

  bio: z
    .string()
    .min(10)
    .max(500),
});

const contentSchema = z.array(
  z.unknown()
);

export const createBlogPostSchema = z.object({
  body: z.object({
    slug: z
      .string()
      .min(3)
      .max(200)
      .regex(
        /^[a-z0-9-]+$/,
        'Slug must be lowercase with hyphens only'
      ),

    title: z
      .string()
      .min(5)
      .max(200),

    excerpt: z
      .string()
      .min(10)
      .max(300),

    content: contentSchema.default([]),

    category: z
      .string()
      .min(2)
      .max(50),

    tags: z
      .array(
        z.string().min(1)
      )
      .max(10)
      .default([]),

    coverImage: blogImageSchema,

    author: authorSchema,

    publishedAt: z
      .string()
      .min(1),
  }),
});

export const updateBlogPostSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: createBlogPostSchema
    .shape
    .body
    .partial(),
});

export const getBlogPostSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const getBlogPostBySlugSchema = z.object({
  params: z.object({
    slug: z.string().min(1),
  }),
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
  params: z.object({
    id: objectId,
  }),
});
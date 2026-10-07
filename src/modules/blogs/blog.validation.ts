
// import { z } from 'zod';

// const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

// /** ?includeUnpublished=true  =>  boolean (only honoured for admins) */
// const booleanFlag = z
//   .enum(['true', 'false'])
//   .default('false')
//   .transform((value) => value === 'true');

// const blogImageSchema = z.object({
//   url: z.string().url('Invalid image URL'),
//   publicId: z.string().min(1, 'Cloudinary public ID is required'),
//   width: z.number().int().positive(),
//   height: z.number().int().positive(),
//   format: z.string().min(1).max(20),
//   bytes: z.number().int().positive(),
// });

// const authorSchema = z.object({
//   name: z.string().trim().min(2).max(100),
//   role: z.string().trim().min(2).max(100),
//   initials: z.string().trim().length(2).toUpperCase(),
//   bio: z.string().trim().min(10).max(500),
// });

// const blogPostBodySchema = z.object({
//   slug: z
//     .string()
//     .min(3)
//     .max(200)
//     .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
//   title: z.string().trim().min(5).max(200),
//   excerpt: z.string().trim().min(10).max(300),
//   content: z.array(z.unknown()).default([]),
//   category: z.string().trim().min(2).max(50),
//   tags: z.array(z.string().trim().min(1)).max(10).default([]),
//   coverImage: blogImageSchema,
//   author: authorSchema,
//   publishedAt: z.coerce.date(),
// });

// export const createBlogPostSchema = z.object({
//   body: blogPostBodySchema,
// });

// export const updateBlogPostSchema = z.object({
//   params: z.object({ id: objectId }),
//   body: blogPostBodySchema
//     .partial()
//     .refine((b) => Object.keys(b).length > 0, 'At least one field is required'),
// });

// export const getBlogPostSchema = z.object({
//   params: z.object({ id: objectId }),
//   query: z.object({ includeUnpublished: booleanFlag }),
// });

// export const getBlogPostBySlugSchema = z.object({
//   params: z.object({ slug: z.string().min(1).max(200) }),
// });

// export const deleteBlogPostSchema = z.object({
//   params: z.object({ id: objectId }),
// });

// export const listBlogPostsSchema = z.object({
//   query: z.object({
//     page: z.coerce.number().int().min(1).default(1),
//     limit: z.coerce.number().int().min(1).max(100).default(10),
//     category: z.string().trim().min(1).optional(),
//     tag: z.string().trim().min(1).optional(),
//     search: z.string().trim().min(1).max(100).optional(),
//     sort: z.enum(['newest', 'oldest']).default('newest'),
//     includeUnpublished: booleanFlag,
//   }),
// });


import { z } from 'zod';

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId');

/** ?includeUnpublished=true  =>  boolean (only honoured for admins) */
const booleanFlag = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true');

const blogImageSchema = z.object({
  url: z.string().url('Invalid image URL'),
  publicId: z.string().min(1, 'Cloudinary public ID is required'),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  format: z.string().min(1).max(20),
  bytes: z.number().int().positive(),
});

const authorSchema = z.object({
  name: z.string().trim().min(2).max(100),
  role: z.string().trim().min(2).max(100),
  initials: z.string().trim().length(2).toUpperCase(),
  bio: z.string().trim().min(10).max(500),
});

/** Rich text HTML must contain visible text or at least one image. */
const hasRichTextContent = (html: string): boolean =>
  html.replace(/<[^>]*>/g, '').trim().length > 0 || /<img\s/i.test(html);

const blogPostBodySchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  title: z.string().trim().min(5).max(200),
  excerpt: z.string().trim().min(10).max(300),
  description: z
    .string()
    .max(100000, 'Description is too long')
    .refine(hasRichTextContent, 'Description is required'),
  content: z.array(z.unknown()).default([]),
  category: z.string().trim().min(2).max(50),
  tags: z.array(z.string().trim().min(1)).max(10).default([]),
  coverImage: blogImageSchema,
  author: authorSchema,
  publishedAt: z.coerce.date(),
});

export const createBlogPostSchema = z.object({
  body: blogPostBodySchema,
});

export const updateBlogPostSchema = z.object({
  params: z.object({ id: objectId }),
  body: blogPostBodySchema
    .partial()
    .refine((b) => Object.keys(b).length > 0, 'At least one field is required'),
});

export const getBlogPostSchema = z.object({
  params: z.object({ id: objectId }),
  query: z.object({ includeUnpublished: booleanFlag }),
});

export const getBlogPostBySlugSchema = z.object({
  params: z.object({ slug: z.string().min(1).max(200) }),
});

export const deleteBlogPostSchema = z.object({
  params: z.object({ id: objectId }),
});

export const listBlogPostsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    category: z.string().trim().min(1).optional(),
    tag: z.string().trim().min(1).optional(),
    search: z.string().trim().min(1).max(100).optional(),
    sort: z.enum(['newest', 'oldest']).default('newest'),
    includeUnpublished: booleanFlag,
  }),
});
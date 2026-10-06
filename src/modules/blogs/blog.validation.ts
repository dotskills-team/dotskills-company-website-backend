// import { z } from 'zod';

// const objectId = z
//   .string()
//   .regex(
//     /^[0-9a-fA-F]{24}$/,
//     'Invalid ObjectId'
//   );

// const blogImageSchema = z.object({
//   url: z
//     .string()
//     .url('Invalid image URL'),

//   publicId: z
//     .string()
//     .min(1, 'Cloudinary public ID is required'),

//   width: z
//     .number()
//     .int()
//     .positive(),

//   height: z
//     .number()
//     .int()
//     .positive(),

//   format: z
//     .string()
//     .min(1)
//     .max(20),

//   bytes: z
//     .number()
//     .int()
//     .positive(),
// });

// const authorSchema = z.object({
//   name: z
//     .string()
//     .min(2)
//     .max(100),

//   role: z
//     .string()
//     .min(2)
//     .max(100),

//   initials: z
//     .string()
//     .length(2)
//     .toUpperCase(),

//   bio: z
//     .string()
//     .min(10)
//     .max(500),
// });

// const contentSchema = z.array(
//   z.unknown()
// );

// export const createBlogPostSchema = z.object({
//   body: z.object({
//     slug: z
//       .string()
//       .min(3)
//       .max(200)
//       .regex(
//         /^[a-z0-9-]+$/,
//         'Slug must be lowercase with hyphens only'
//       ),

//     title: z
//       .string()
//       .min(5)
//       .max(200),

//     excerpt: z
//       .string()
//       .min(10)
//       .max(300),

//     content: contentSchema.default([]),

//     category: z
//       .string()
//       .min(2)
//       .max(50),

//     tags: z
//       .array(
//         z.string().min(1)
//       )
//       .max(10)
//       .default([]),

//     coverImage: blogImageSchema,

//     author: authorSchema,

//     publishedAt: z
//       .string()
//       .min(1),
//   }),
// });

// export const updateBlogPostSchema = z.object({
//   params: z.object({
//     id: objectId,
//   }),

//   body: createBlogPostSchema
//     .shape
//     .body
//     .partial(),
// });

// export const getBlogPostSchema = z.object({
//   params: z.object({
//     id: objectId,
//   }),
// });

// export const getBlogPostBySlugSchema = z.object({
//   params: z.object({
//     slug: z.string().min(1),
//   }),
// });

// export const listBlogPostsSchema = z.object({
//   query: z.object({
//     page: z.string().optional(),

//     limit: z.string().optional(),

//     category: z.string().optional(),

//     tag: z.string().optional(),

//     search: z.string().optional(),

//     sort: z.string().optional(),
//   }),
// });

// export const deleteBlogPostSchema = z.object({
//   params: z.object({
//     id: objectId,
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

const blogPostBodySchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens only'),
  title: z.string().trim().min(5).max(200),
  excerpt: z.string().trim().min(10).max(300),
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
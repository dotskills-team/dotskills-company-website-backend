// export interface BlogImage {
//   url: string;
//   publicId: string;
//   width: number;
//   height: number;
//   format: string;
//   bytes: number;
// }

// export interface Author {
//   name: string;
//   role: string;
//   initials: string;
//   bio: string;
// }

// export interface BlogPostInput {
//   slug: string;
//   title: string;
//   excerpt: string;
//   content: unknown[];
//   category: string;
//   tags: string[];
//   coverImage: BlogImage;
//   author: Author;
//   publishedAt: string;
// }

// export interface BlogPostQuery {
//   page?: string;
//   limit?: string;
//   category?: string;
//   tag?: string;
//   search?: string;
//   sort?: string;
// }

// export interface PaginatedBlogPosts {
//   data: unknown[];
//   meta: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }
import type { z } from 'zod';

import type {
  createBlogPostSchema,
  listBlogPostsSchema,
  updateBlogPostSchema,
} from './blog.validation';

/** Types are derived from Zod, so validation and types never drift apart. */
export type BlogPostInput = z.infer<typeof createBlogPostSchema>['body'];
export type BlogPostUpdateInput = z.infer<typeof updateBlogPostSchema>['body'];
export type BlogPostQuery = z.infer<typeof listBlogPostsSchema>['query'];

export type BlogImage = BlogPostInput['coverImage'];
export type Author = BlogPostInput['author'];
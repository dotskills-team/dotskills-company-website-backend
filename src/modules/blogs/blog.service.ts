// import { blogRepository } from './blog.repository';

// import { ApiError } from '../../utils/ApiError';

// import type {
//   BlogPostInput,
//   BlogPostQuery,
// } from './blog.types';

// import { getPagination } from '../../utils/pagination';

// import type {
//   IBlogPost,
// } from './blogPost.model';

// export interface ListPostsResult {
//   data: IBlogPost[];

//   meta: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
// }

// export class BlogService {
//   async createPost(
//     payload: BlogPostInput
//   ): Promise<IBlogPost> {
//     if (
//       await blogRepository.slugExists(
//         payload.slug
//       )
//     ) {
//       throw ApiError.conflict(
//         `Slug '${payload.slug}' already exists`
//       );
//     }

//     return blogRepository.create(
//       payload
//     );
//   }

//   async getPostById(
//     id: string
//   ): Promise<IBlogPost> {
//     const post =
//       await blogRepository.findById(id);

//     if (!post) {
//       throw ApiError.notFound(
//         'Blog post not found'
//       );
//     }

//     return post;
//   }

//   async getPostBySlug(
//     slug: string
//   ): Promise<IBlogPost> {
//     const post =
//       await blogRepository.findBySlug(slug);

//     if (!post) {
//       throw ApiError.notFound(
//         'Blog post not found'
//       );
//     }

//     return post;
//   }

//   async listPosts(
//     query: BlogPostQuery
//   ): Promise<ListPostsResult> {
//     const pagination =
//       getPagination(
//         query as Record<string, unknown>
//       );

//     const filter: Record<
//       string,
//       unknown
//     > = {};

//     if (query.category) {
//       filter['category'] =
//         query.category;
//     }

//     if (query.tag) {
//       filter['tags'] =
//         query.tag;
//     }

//     if (query.search) {
//       filter['$text'] = {
//         $search: query.search,
//       };
//     }

//     const {
//       docs,
//       total,
//       page,
//       limit,
//       totalPages,
//     } =
//       await blogRepository.paginate(
//         filter,
//         pagination
//       );

//     return {
//       data: docs,

//       meta: {
//         page,
//         limit,
//         total,
//         totalPages,
//       },
//     };
//   }

//   async updatePost(
//     id: string,
//     payload: Partial<BlogPostInput>
//   ): Promise<IBlogPost> {
//     const existing =
//       await blogRepository.findById(id);

//     if (!existing) {
//       throw ApiError.notFound(
//         'Blog post not found'
//       );
//     }

//     if (
//       payload.slug &&
//       (
//         await blogRepository.slugExists(
//           payload.slug,
//           id
//         )
//       )
//     ) {
//       throw ApiError.conflict(
//         `Slug '${payload.slug}' already exists`
//       );
//     }

//     const updated =
//       await blogRepository.updateById(
//         id,
//         payload
//       );

//     if (!updated) {
//       throw ApiError.notFound(
//         'Blog post not found'
//       );
//     }

//     return updated;
//   }

//   async deletePost(
//     id: string
//   ): Promise<IBlogPost> {
//     const deleted =
//       await blogRepository.deleteById(id);

//     if (!deleted) {
//       throw ApiError.notFound(
//         'Blog post not found'
//       );
//     }

//     return deleted;
//   }
// }

// export const blogService =
//   new BlogService();
import type { QueryFilter } from 'mongoose';

import { ApiError } from '../../utils/ApiError';
import type { PaginationMeta } from '../../utils/ApiResponse';

import { blogRepository } from './blog.repository';
import type {
  BlogPostInput,
  BlogPostQuery,
  BlogPostUpdateInput,
} from './blog.types';
import type { BlogPostDto, IBlogPost } from './blogPost.model';

export interface ListPostsResult {
  data: BlogPostDto[];
  meta: PaginationMeta;
}

const isDuplicateKey = (err: unknown): boolean =>
  typeof err === 'object' &&
  err !== null &&
  (err as { code?: unknown }).code === 11000;

export class BlogService {
  async createPost(payload: BlogPostInput): Promise<BlogPostDto> {
    try {
      return await blogRepository.create(payload);
    } catch (err) {
      // The unique index is the source of truth (no check-then-insert race).
      if (isDuplicateKey(err)) {
        throw ApiError.conflict(`Slug '${payload.slug}' already exists`);
      }
      throw err;
    }
  }

  async getPostById(
    id: string,
    includeUnpublished = false
  ): Promise<BlogPostDto> {
    const post = await blogRepository.findById(id, includeUnpublished);
    if (!post) throw ApiError.notFound('Blog post not found');
    return post;
  }

  async getPostBySlug(slug: string): Promise<BlogPostDto> {
    const post = await blogRepository.findPublishedBySlug(slug);
    if (!post) throw ApiError.notFound('Blog post not found');
    return post;
  }

  async listPosts(query: BlogPostQuery): Promise<ListPostsResult> {
    const { page, limit, category, tag, search, sort, includeUnpublished } =
      query;

    const filter: QueryFilter<IBlogPost> = includeUnpublished
      ? {}
      : { publishedAt: { $lte: new Date() } };

    if (category) filter.category = category;
    if (tag) filter.tags = tag;
    if (search) filter.$text = { $search: search };

    const publishedOrder = sort === 'oldest' ? 1 : -1;

    const { docs, total } = await blogRepository.paginate(filter, {
      page,
      limit,
      textSearch: Boolean(search),
      sort: search
        ? { score: { $meta: 'textScore' }, publishedAt: publishedOrder }
        : { publishedAt: publishedOrder },
    });

    return {
      data: docs,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async updatePost(
    id: string,
    payload: BlogPostUpdateInput
  ): Promise<BlogPostDto> {
    try {
      const updated = await blogRepository.updateById(id, payload);
      if (!updated) throw ApiError.notFound('Blog post not found');
      return updated;
    } catch (err) {
      if (isDuplicateKey(err)) {
        throw ApiError.conflict(`Slug '${payload.slug ?? ''}' already exists`);
      }
      throw err;
    }
  }

  async deletePost(id: string): Promise<void> {
    const deleted = await blogRepository.deleteById(id);
    if (!deleted) throw ApiError.notFound('Blog post not found');
  }
}

export const blogService = new BlogService();
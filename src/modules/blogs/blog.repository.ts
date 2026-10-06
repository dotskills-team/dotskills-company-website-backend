// import type {
//   UpdateQuery,
// } from 'mongoose';

// import { BlogPost } from './blogPost.model';

// import type {
//   IBlogPost,
// } from './blogPost.model';

// import type {
//   BlogPostInput,
// } from './blog.types';

// import type {
//   PaginationResult,
// } from '../../utils/pagination';

// type BlogPostLean =
//   IBlogPost & {
//     _id: unknown;
//   };

// export class BlogRepository {
//   async create(
//     payload: BlogPostInput
//   ): Promise<IBlogPost> {
//     return BlogPost.create(
//       payload
//     );
//   }

//   async findById(
//     id: string
//   ): Promise<IBlogPost | null> {
//     const doc =
//       await BlogPost
//         .findById(id)
//         .lean<BlogPostLean>();

//     if (!doc) {
//       return null;
//     }

//     return {
//       ...doc,
//       id: String(doc._id),
//     } as IBlogPost;
//   }

//   async findBySlug(
//     slug: string
//   ): Promise<IBlogPost | null> {
//     const doc =
//       await BlogPost
//         .findOne({ slug })
//         .lean<BlogPostLean>();

//     if (!doc) {
//       return null;
//     }

//     return {
//       ...doc,
//       id: String(doc._id),
//     } as IBlogPost;
//   }

//   async updateById(
//     id: string,
//     payload: UpdateQuery<IBlogPost>
//   ): Promise<IBlogPost | null> {
//     return BlogPost.findByIdAndUpdate(
//       id,
//       payload,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//   }

//   async deleteById(
//     id: string
//   ): Promise<IBlogPost | null> {
//     return BlogPost.findByIdAndDelete(
//       id
//     );
//   }

//   async paginate(
//     filter: Record<string, unknown>,
//     {
//       page,
//       limit,
//       skip,
//       sort,
//     }: PaginationResult
//   ): Promise<{
//     docs: IBlogPost[];
//     total: number;
//     page: number;
//     limit: number;
//     totalPages: number;
//   }> {
//     const [
//       docs,
//       total,
//     ] = await Promise.all([
//       BlogPost.find(filter)
//         .sort(sort)
//         .skip(skip)
//         .limit(limit)
//         .lean<BlogPostLean[]>(),

//       BlogPost.countDocuments(
//         filter
//       ),
//     ]);

//     const withIds =
//       docs.map((doc) => ({
//         ...doc,
//         id: String(doc._id),
//       })) as IBlogPost[];

//     return {
//       docs: withIds,
//       total,
//       page,
//       limit,
//       totalPages:
//         Math.ceil(total / limit),
//     };
//   }

//   async slugExists(
//     slug: string,
//     excludeId?: string
//   ): Promise<boolean> {
//     return BlogPost.isSlugTaken(
//       slug,
//       excludeId
//     );
//   }
// }

// export const blogRepository =
//   new BlogRepository();
import type { QueryFilter, SortOrder } from 'mongoose';

import { BlogPost } from './blogPost.model';
import type { BlogPostDocument, BlogPostDto, IBlogPost } from './blogPost.model';
import type { BlogPostInput, BlogPostUpdateInput } from './blog.types';

export interface PaginateOptions {
  page: number;
  limit: number;
  sort: Record<string, SortOrder | { $meta: 'textScore' }>;
  textSearch: boolean;
}

export interface PaginatedResult {
  docs: BlogPostDto[];
  total: number;
}

/** Single place where documents are converted to the API shape. */
const toDto = (doc: BlogPostDocument): BlogPostDto =>
  doc.toJSON() as unknown as BlogPostDto;

export class BlogRepository {
  async create(payload: BlogPostInput): Promise<BlogPostDto> {
    const doc = await BlogPost.create(payload);
    return toDto(doc);
  }

  async findById(
    id: string,
    includeUnpublished = false
  ): Promise<BlogPostDto | null> {
    const filter: QueryFilter<IBlogPost> = includeUnpublished
      ? { _id: id }
      : { _id: id, publishedAt: { $lte: new Date() } };

    const doc = await BlogPost.findOne(filter);
    return doc ? toDto(doc) : null;
  }

  async findPublishedBySlug(slug: string): Promise<BlogPostDto | null> {
    const doc = await BlogPost.findOne({
      slug,
      publishedAt: { $lte: new Date() },
    });
    return doc ? toDto(doc) : null;
  }

  async updateById(
    id: string,
    payload: BlogPostUpdateInput
  ): Promise<BlogPostDto | null> {
    const doc = await BlogPost.findByIdAndUpdate(
      id,
      { $set: payload },
      { new: true, runValidators: true }
    );
    return doc ? toDto(doc) : null;
  }

  async deleteById(id: string): Promise<BlogPostDto | null> {
    const doc = await BlogPost.findByIdAndDelete(id);
    return doc ? toDto(doc) : null;
  }

  async paginate(
    filter: QueryFilter<IBlogPost>,
    { page, limit, sort, textSearch }: PaginateOptions
  ): Promise<PaginatedResult> {
    const query = BlogPost.find(
      filter,
      textSearch ? { score: { $meta: 'textScore' } } : undefined
    )
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    const [docs, total] = await Promise.all([
      query.exec(),
      BlogPost.countDocuments(filter),
    ]);

    return { docs: docs.map(toDto), total };
  }
}

export const blogRepository = new BlogRepository();
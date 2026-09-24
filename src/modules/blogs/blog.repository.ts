import type {
  UpdateQuery,
} from 'mongoose';

import { BlogPost } from './blogPost.model';

import type {
  IBlogPost,
} from './blogPost.model';

import type {
  BlogPostInput,
} from './blog.types';

import type {
  PaginationResult,
} from '../../utils/pagination';

type BlogPostLean =
  IBlogPost & {
    _id: unknown;
  };

export class BlogRepository {
  async create(
    payload: BlogPostInput
  ): Promise<IBlogPost> {
    return BlogPost.create(
      payload
    );
  }

  async findById(
    id: string
  ): Promise<IBlogPost | null> {
    const doc =
      await BlogPost
        .findById(id)
        .lean<BlogPostLean>();

    if (!doc) {
      return null;
    }

    return {
      ...doc,
      id: String(doc._id),
    } as IBlogPost;
  }

  async findBySlug(
    slug: string
  ): Promise<IBlogPost | null> {
    const doc =
      await BlogPost
        .findOne({ slug })
        .lean<BlogPostLean>();

    if (!doc) {
      return null;
    }

    return {
      ...doc,
      id: String(doc._id),
    } as IBlogPost;
  }

  async updateById(
    id: string,
    payload: UpdateQuery<IBlogPost>
  ): Promise<IBlogPost | null> {
    return BlogPost.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async deleteById(
    id: string
  ): Promise<IBlogPost | null> {
    return BlogPost.findByIdAndDelete(
      id
    );
  }

  async paginate(
    filter: Record<string, unknown>,
    {
      page,
      limit,
      skip,
      sort,
    }: PaginationResult
  ): Promise<{
    docs: IBlogPost[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const [
      docs,
      total,
    ] = await Promise.all([
      BlogPost.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean<BlogPostLean[]>(),

      BlogPost.countDocuments(
        filter
      ),
    ]);

    const withIds =
      docs.map((doc) => ({
        ...doc,
        id: String(doc._id),
      })) as IBlogPost[];

    return {
      docs: withIds,
      total,
      page,
      limit,
      totalPages:
        Math.ceil(total / limit),
    };
  }

  async slugExists(
    slug: string,
    excludeId?: string
  ): Promise<boolean> {
    return BlogPost.isSlugTaken(
      slug,
      excludeId
    );
  }
}

export const blogRepository =
  new BlogRepository();
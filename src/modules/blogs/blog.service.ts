import type { FilterQuery } from 'mongoose';
import { blogRepository } from './blog.repository';
import { ApiError } from '../../utils/ApiError';
import type { BlogPostInput, BlogPostQuery } from './blog.types';
import { getPagination } from '../../utils/pagination';
import { IBlogPost } from './blogPost.model';

export interface ListPostsResult {
  data: IBlogPost[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export class BlogService {
  async createPost(payload: BlogPostInput): Promise<IBlogPost> {
    if (await blogRepository.slugExists(payload.slug)) {
      throw ApiError.conflict(`Slug '${payload.slug}' already exists`);
    }
    return blogRepository.create(payload);
  }

  async getPostById(id: string): Promise<IBlogPost> {
    const post = await blogRepository.findById(id);
    if (!post) throw ApiError.notFound('Blog post not found');
    return post;
  }

  async getPostBySlug(slug: string): Promise<IBlogPost> {
    const post = await blogRepository.findBySlug(slug);
    if (!post) throw ApiError.notFound('Blog post not found');
    return post;
  }

  async listPosts(query: BlogPostQuery): Promise<ListPostsResult> {
    const pagination = getPagination(query as Record<string, unknown>);

    const filter: FilterQuery<IBlogPost> = {};
    if (query.category) filter['category'] = query.category;
    if (query.tag) filter['tags'] = query.tag;
    if (query.search) filter['$text'] = { $search: query.search };

    const { docs, total, page, limit, totalPages } = await blogRepository.paginate(
      filter,
      pagination
    );

    return { data: docs, meta: { page, limit, total, totalPages } };
  }

  async updatePost(id: string, payload: Partial<BlogPostInput>): Promise<IBlogPost> {
    const existing = await blogRepository.findById(id);
    if (!existing) throw ApiError.notFound('Blog post not found');

    if (payload.slug && (await blogRepository.slugExists(payload.slug, id))) {
      throw ApiError.conflict(`Slug '${payload.slug}' already exists`);
    }

    const updated = await blogRepository.updateById(id, payload);
    if (!updated) throw ApiError.notFound('Blog post not found');
    return updated;
  }

  async deletePost(id: string): Promise<IBlogPost> {
    const deleted = await blogRepository.deleteById(id);
    if (!deleted) throw ApiError.notFound('Blog post not found');
    return deleted;
  }
}

export const blogService = new BlogService();
import { FilterQuery, UpdateQuery } from 'mongoose';
import { BlogPost, IBlogPost } from './blogPost.model';
import { BlogPostInput } from './blog.types';
import { PaginationResult } from '../../utils/pagination';

// ✅ Helper: Mongo document → clean object with `id`
const toPlain = (doc: IBlogPost & { _id: unknown }) => ({
  ...doc,
  id: String(doc._id),
  _id: undefined,   // optionally hide
});

export class BlogRepository {
  async create(payload: BlogPostInput): Promise<IBlogPost> {
    return BlogPost.create(payload);
  }

  async findById(id: string): Promise<IBlogPost | null> {
    const doc = await BlogPost.findById(id).lean<IBlogPost>();
    if (!doc) return null;
    return { ...doc, id: String(doc._id) } as unknown as IBlogPost;
  }

  async findBySlug(slug: string): Promise<IBlogPost | null> {
    const doc = await BlogPost.findOne({ slug }).lean<IBlogPost>();
    if (!doc) return null;
    return { ...doc, id: String(doc._id) } as unknown as IBlogPost;
  }

  async updateById(id: string, payload: UpdateQuery<IBlogPost>): Promise<IBlogPost | null> {
    return BlogPost.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  }

  async deleteById(id: string): Promise<IBlogPost | null> {
    return BlogPost.findByIdAndDelete(id);
  }

  async paginate(
    filter: FilterQuery<IBlogPost>,
    { page, limit, skip, sort }: PaginationResult
  ) {
    const [docs, total] = await Promise.all([
      BlogPost.find(filter).sort(sort).skip(skip).limit(limit).lean<IBlogPost[]>(),
      BlogPost.countDocuments(filter),
    ]);

    // ✅ প্রতিটা doc এ `id` field যোগ করুন
    const withIds = docs.map((doc) => ({
      ...doc,
      id: String(doc._id),
    }));

    return {
      docs: withIds,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    return BlogPost.isSlugTaken(slug, excludeId);
  }
}

export const blogRepository = new BlogRepository();
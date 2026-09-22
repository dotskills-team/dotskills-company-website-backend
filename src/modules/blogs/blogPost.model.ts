import { Schema, model, type Document, type Model, type FilterQuery } from 'mongoose';
import type { Author } from './blog.types';

export interface IBlogPost extends Document {
  slug: string;
  title: string;
  excerpt: string;
  content: {
  type: Schema.Types.Mixed,
  default: [],
},
  category: string;
  tags: string[];
  coverImage: string;
  author: Author;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogPostModel extends Model<IBlogPost> {
  isSlugTaken(slug: string, excludeId?: string): Promise<boolean>;
}

const authorSchema = new Schema<Author>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    initials: { type: String, required: true, maxlength: 2 },
    bio: { type: String, required: true, maxlength: 500 },
  },
  { _id: false }
);

const blogPostSchema = new Schema<IBlogPost, IBlogPostModel>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    excerpt: { type: String, required: true, maxlength: 300 },
        content: { type: Schema.Types.Mixed, default: [] },   

    category: { type: String, required: true, index: true },
    
    tags: { type: [String], default: [], index: true },
    coverImage: { type: String, required: true },
    author: { type: authorSchema, required: true },
    publishedAt: { type: Date, required: true, index: true },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret['id'] = String(ret['_id']);
        delete ret['_id'];
        return ret;
      },
    },
  }
);

blogPostSchema.index({ category: 1, publishedAt: -1 });
blogPostSchema.index({ tags: 1, publishedAt: -1 });
blogPostSchema.index({ title: 'text', excerpt: 'text', 'author.name': 'text' });

blogPostSchema.statics.isSlugTaken = async function (
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const query: FilterQuery<IBlogPost> = { slug };
  if (excludeId) query['_id'] = { $ne: excludeId };
  const count = await this.countDocuments(query);
  return count > 0;
};

export const BlogPost = model<IBlogPost, IBlogPostModel>('BlogPost', blogPostSchema);
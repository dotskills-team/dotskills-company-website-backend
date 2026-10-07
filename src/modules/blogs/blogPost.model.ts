
import { Schema, model, type HydratedDocument } from 'mongoose';

import type { Author, BlogImage } from './blog.types';

export interface IBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  /** Rich text (sanitized HTML) written in the admin editor. */
  description: string;
  content: unknown[];
  category: string;
  tags: string[];
  coverImage: BlogImage;
  author: Author;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

/** Shape returned to API clients (always `id`, never `_id`). */
export type BlogPostDto = IBlogPost & { id: string };

export type BlogPostDocument = HydratedDocument<IBlogPost>;

const blogImageSchema = new Schema<BlogImage>(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, required: true, trim: true },
    width: { type: Number, required: true, min: 1 },
    height: { type: Number, required: true, min: 1 },
    format: { type: String, required: true, trim: true },
    bytes: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const authorSchema = new Schema<Author>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    initials: { type: String, required: true, maxlength: 2, trim: true },
    bio: { type: String, required: true, maxlength: 500, trim: true },
  },
  { _id: false }
);

const blogPostSchema = new Schema<IBlogPost>(
  {
    slug: {
      type: String,
      required: true,
      unique: true, // creates the unique index (no extra `index: true`)
      lowercase: true,
      trim: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    excerpt: { type: String, required: true, trim: true, maxlength: 300 },
    // default '' so existing documents (created before this field) stay valid
    description: { type: String, default: '', trim: true, maxlength: 100000 },
    content: { type: [Schema.Types.Mixed], default: [] },
    category: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    coverImage: { type: blogImageSchema, required: true },
    author: { type: authorSchema, required: true },
    publishedAt: { type: Date, required: true },
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
blogPostSchema.index({ publishedAt: -1 });
blogPostSchema.index({ title: 'text', excerpt: 'text', 'author.name': 'text' });

export const BlogPost = model<IBlogPost>('BlogPost', blogPostSchema);





// import { Schema, model, type HydratedDocument } from 'mongoose';

// import type { Author, BlogImage } from './blog.types';

// export interface IBlogPost {
//   slug: string;
//   title: string;
//   excerpt: string;
//   content: unknown[];
//   category: string;
//   tags: string[];
//   coverImage: BlogImage;
//   author: Author;
//   publishedAt: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }

// /** Shape returned to API clients (always `id`, never `_id`). */
// export type BlogPostDto = IBlogPost & { id: string };

// export type BlogPostDocument = HydratedDocument<IBlogPost>;

// const blogImageSchema = new Schema<BlogImage>(
//   {
//     url: { type: String, required: true, trim: true },
//     publicId: { type: String, required: true, trim: true },
//     width: { type: Number, required: true, min: 1 },
//     height: { type: Number, required: true, min: 1 },
//     format: { type: String, required: true, trim: true },
//     bytes: { type: Number, required: true, min: 1 },
//   },
//   { _id: false }
// );

// const authorSchema = new Schema<Author>(
//   {
//     name: { type: String, required: true, trim: true },
//     role: { type: String, required: true, trim: true },
//     initials: { type: String, required: true, maxlength: 2, trim: true },
//     bio: { type: String, required: true, maxlength: 500, trim: true },
//   },
//   { _id: false }
// );

// const blogPostSchema = new Schema<IBlogPost>(
//   {
//     slug: {
//       type: String,
//       required: true,
//       unique: true, // creates the unique index (no extra `index: true`)
//       lowercase: true,
//       trim: true,
//     },
//     title: { type: String, required: true, trim: true, maxlength: 200 },
//     excerpt: { type: String, required: true, trim: true, maxlength: 300 },
//     content: { type: [Schema.Types.Mixed], default: [] },
//     category: { type: String, required: true, trim: true },
//     tags: { type: [String], default: [] },
//     coverImage: { type: blogImageSchema, required: true },
//     author: { type: authorSchema, required: true },
//     publishedAt: { type: Date, required: true },
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//     toJSON: {
//       virtuals: true,
//       transform: (_doc, ret: Record<string, unknown>) => {
//         ret['id'] = String(ret['_id']);
//         delete ret['_id'];
//         return ret;
//       },
//     },
//   }
// );

// blogPostSchema.index({ category: 1, publishedAt: -1 });
// blogPostSchema.index({ tags: 1, publishedAt: -1 });
// blogPostSchema.index({ publishedAt: -1 });
// blogPostSchema.index({ title: 'text', excerpt: 'text', 'author.name': 'text' });

// export const BlogPost = model<IBlogPost>('BlogPost', blogPostSchema);
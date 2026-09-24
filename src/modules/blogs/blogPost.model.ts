import {
  Schema,
  model,
  type Model,
} from 'mongoose';

import type {
  Author,
  BlogImage,
} from './blog.types';

export interface IBlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: unknown[];
  category: string;
  tags: string[];
  coverImage: BlogImage;
  author: Author;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlogPostModel extends Model<IBlogPost> {
  isSlugTaken(
    slug: string,
    excludeId?: string
  ): Promise<boolean>;
}

/**
 * Reusable Cloudinary image schema
 */
const blogImageSchema = new Schema<BlogImage>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },

    publicId: {
      type: String,
      required: true,
      trim: true,
    },

    width: {
      type: Number,
      required: true,
      min: 1,
    },

    height: {
      type: Number,
      required: true,
      min: 1,
    },

    format: {
      type: String,
      required: true,
      trim: true,
    },

    bytes: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    _id: false,
  }
);

/**
 * Author schema
 */
const authorSchema = new Schema<Author>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    initials: {
      type: String,
      required: true,
      maxlength: 2,
      trim: true,
    },

    bio: {
      type: String,
      required: true,
      maxlength: 500,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/**
 * Blog post schema
 */
const blogPostSchema = new Schema<
  IBlogPost,
  IBlogPostModel
>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    excerpt: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    content: {
      type: Schema.Types.Mixed,
      default: [],
    },

    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    /**
     * Cloudinary image metadata
     */
    coverImage: {
      type: blogImageSchema,
      required: true,
    },

    author: {
      type: authorSchema,
      required: true,
    },

    publishedAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,

    toJSON: {
      virtuals: true,

      transform: (
        _doc,
        ret: Record<string, unknown>
      ) => {
        ret['id'] = String(ret['_id']);

        delete ret['_id'];

        return ret;
      },
    },
  }
);

/**
 * Indexes
 */
blogPostSchema.index({
  category: 1,
  publishedAt: -1,
});

blogPostSchema.index({
  tags: 1,
  publishedAt: -1,
});

blogPostSchema.index({
  title: 'text',
  excerpt: 'text',
  'author.name': 'text',
});

/**
 * Check slug availability
 */
blogPostSchema.statics.isSlugTaken = async function (
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const query: Record<string, unknown> = {
    slug,
  };

  if (excludeId) {
    query['_id'] = {
      $ne: excludeId,
    };
  }

  const count = await this.countDocuments(query);

  return count > 0;
};

export const BlogPost = model<
  IBlogPost,
  IBlogPostModel
>(
  'BlogPost',
  blogPostSchema
);
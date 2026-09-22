export interface Author {
  name: string;
  role: string;
  initials: string;
  bio: string;
}

export interface BlogPostInput {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: Author;
  publishedAt: string;
}

export interface BlogPostQuery {
  page?: string;
  limit?: string;
  category?: string;
  tag?: string;
  search?: string;
  sort?: string;
}

export interface PaginatedBlogPosts {
  data: unknown[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
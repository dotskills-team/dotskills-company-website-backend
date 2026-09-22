export interface PaginationResult {
  page: number;
  limit: number;
  skip: number;
  sort: Record<string, 1 | -1>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const getPagination = (
  query: Record<string, unknown>,
  defaultSort = '-publishedAt'
): PaginationResult => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const sortField = (query.sort as string | undefined) ?? defaultSort;
  const sort: Record<string, 1 | -1> = {};

  if (sortField.startsWith('-')) {
    sort[sortField.slice(1)] = -1;
  } else {
    sort[sortField] = 1;
  }

  return { page, limit, skip, sort };
};

export const buildPaginationMeta = (
  total: number,
  page: number,
  limit: number
): PaginationMeta => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
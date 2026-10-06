// import type {
//   Request,
//   Response,
// } from 'express';

// import { blogService } from './blog.service';

// import { ApiResponse } from '../../utils/ApiResponse';

// import { asyncHandler } from '../../utils/asyncHandler';

// import type {
//   BlogPostQuery,
// } from './blog.types';

// export const blogController = {
//   create: asyncHandler(
//     async (
//       req: Request,
//       res: Response
//     ) => {
//       const post =
//         await blogService.createPost(
//           req.body
//         );

//       return ApiResponse.created(
//         res,
//         post,
//         'Blog post created'
//       );
//     }
//   ),

//   list: asyncHandler(
//     async (
//       req: Request,
//       res: Response
//     ) => {
//       const {
//         data,
//         meta,
//       } = await blogService.listPosts(
//         req.query as BlogPostQuery
//       );

//       return ApiResponse.ok(
//         res,
//         data,
//         'Blog posts fetched',
//         meta
//       );
//     }
//   ),

//   getById: asyncHandler(
//     async (
//       req: Request,
//       res: Response
//     ) => {
//       const post =
//         await blogService.getPostById(
//           req.params['id'] as string
//         );

//       return ApiResponse.ok(
//         res,
//         post
//       );
//     }
//   ),

//   getBySlug: asyncHandler(
//     async (
//       req: Request,
//       res: Response
//     ) => {
//       const post =
//         await blogService.getPostBySlug(
//           req.params['slug'] as string
//         );

//       return ApiResponse.ok(
//         res,
//         post
//       );
//     }
//   ),

//   update: asyncHandler(
//     async (
//       req: Request,
//       res: Response
//     ) => {
//       const post =
//         await blogService.updatePost(
//           req.params['id'] as string,
//           req.body
//         );

//       return ApiResponse.ok(
//         res,
//         post,
//         'Blog post updated'
//       );
//     }
//   ),

//   remove: asyncHandler(
//     async (
//       req: Request,
//       res: Response
//     ) => {
//       await blogService.deletePost(
//         req.params['id'] as string
//       );

//       return ApiResponse.noContent(
//         res
//       );
//     }
//   ),
// };
import type { Request, Response } from 'express';

import { ApiError } from '../../utils/ApiError';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';

import { blogService } from './blog.service';
import type { BlogPostQuery } from './blog.types';

const param = (req: Request, key: string): string => req.params[key] as string;

/**
 * Only admins may request unpublished / scheduled posts.
 * - no valid token  => 401 (the frontend silently refreshes its token and retries)
 * - not an admin    => 403
 */
const resolveIncludeUnpublished = (req: Request, requested: boolean): boolean => {
  if (!requested) return false;

  if (!req.user) {
    throw ApiError.unauthorized('Authentication required');
  }

  if (req.user.role !== 'admin') {
    throw ApiError.forbidden('Admin access required');
  }

  return true;
};

export const blogController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const post = await blogService.createPost(req.body);
    return ApiResponse.created(res, post, 'Blog post created');
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    // `req.query` is already validated and coerced by the validate middleware
    const query = req.query as unknown as BlogPostQuery;

    const { data, meta } = await blogService.listPosts({
      ...query,
      includeUnpublished: resolveIncludeUnpublished(
        req,
        query.includeUnpublished
      ),
    });
    return ApiResponse.ok(res, data, 'Blog posts fetched', meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const { includeUnpublished } = req.query as unknown as {
      includeUnpublished: boolean;
    };

    const post = await blogService.getPostById(
      param(req, 'id'),
      resolveIncludeUnpublished(req, includeUnpublished)
    );
    return ApiResponse.ok(res, post);
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const post = await blogService.getPostBySlug(param(req, 'slug'));
    return ApiResponse.ok(res, post);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const post = await blogService.updatePost(param(req, 'id'), req.body);
    return ApiResponse.ok(res, post, 'Blog post updated');
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await blogService.deletePost(param(req, 'id'));
    return ApiResponse.noContent(res);
  }),
};
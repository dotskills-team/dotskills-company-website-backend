import type { Request, Response } from 'express';
import { blogService } from './blog.service';
import { ApiResponse } from '../../utils/ApiResponse';
import { asyncHandler } from '../../utils/asyncHandler';
import type { BlogPostQuery } from './blog.types';

export const blogController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const post = await blogService.createPost(req.body);
    return ApiResponse.created(res, post, 'Blog post created');
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const { data, meta } = await blogService.listPosts(req.query as BlogPostQuery);
    return ApiResponse.ok(res, data, 'Blog posts fetched', meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const post = await blogService.getPostById(req.params['id'] as string);
    return ApiResponse.ok(res, post);
  }),

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    const post = await blogService.getPostBySlug(req.params['slug'] as string);
    return ApiResponse.ok(res, post);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const post = await blogService.updatePost(req.params['id'] as string, req.body);
    return ApiResponse.ok(res, post, 'Blog post updated');
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await blogService.deletePost(req.params['id'] as string);
    return ApiResponse.noContent(res);
  }),
};
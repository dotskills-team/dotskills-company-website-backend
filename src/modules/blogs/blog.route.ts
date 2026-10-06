import { Router } from 'express';

import { requireAdmin } from '../../middlewares/admin.middleware';
import { optionalAuth, requireAuth } from '../../middlewares/auth.middleware';
import { writeLimiter } from '../../middlewares/rateLimiter.middleware';
import { validate } from '../../middlewares/validate.middleware';

import { blogController } from './blog.controller';
import {
  createBlogPostSchema,
  deleteBlogPostSchema,
  getBlogPostBySlugSchema,
  getBlogPostSchema,
  listBlogPostsSchema,
  updateBlogPostSchema,
} from './blog.validation';

const router = Router();

/** Public routes */
router.get('/', optionalAuth, validate(listBlogPostsSchema), blogController.list);

// must stay BEFORE '/:id'
router.get(
  '/slug/:slug',
  validate(getBlogPostBySlugSchema),
  blogController.getBySlug
);

router.get('/:id', optionalAuth, validate(getBlogPostSchema), blogController.getById);

/** Protected routes */
router.post(
  '/',
  requireAuth,
  requireAdmin,
  writeLimiter,
  validate(createBlogPostSchema),
  blogController.create
);

router.patch(
  '/:id',
  requireAuth,
  requireAdmin,
  writeLimiter,
  validate(updateBlogPostSchema),
  blogController.update
);

router.delete(
  '/:id',
  requireAuth,
  requireAdmin,
  writeLimiter,
  validate(deleteBlogPostSchema),
  blogController.remove
);

export default router;
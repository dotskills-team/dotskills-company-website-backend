import { Router } from 'express';
import { blogController } from './blog.controller';
import { validate } from '../../middlewares/validate.middleware';
import {
  createBlogPostSchema,
  updateBlogPostSchema,
  getBlogPostSchema,
  getBlogPostBySlugSchema,
  listBlogPostsSchema,
  deleteBlogPostSchema,
} from './blog.validation.js';
import { writeLimiter } from '../../middlewares/rateLimiter.middleware';
import { requireAuth } from '../../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', validate(listBlogPostsSchema), blogController.list);
router.get('/slug/:slug', validate(getBlogPostBySlugSchema), blogController.getBySlug);

// Protected routes
router.post(
  '/',
  requireAuth,
  writeLimiter,
  validate(createBlogPostSchema),
  blogController.create
);

router
  .route('/:id')
  .get(validate(getBlogPostSchema), blogController.getById)
  .patch(requireAuth, writeLimiter, validate(updateBlogPostSchema), blogController.update)
  .delete(requireAuth, validate(deleteBlogPostSchema), blogController.remove);

export default router;
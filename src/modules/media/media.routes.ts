// import { Router } from "express";
// import { uploadBlogImage } from "./media.controller";
// import { uploadImage } from "../../middlewares/upload.middleware";
// // import { uploadImage } from "../../middlewares/upload.middleware.js";
// // import { uploadBlogImage } from "./media.controller.js";

// const router = Router();

// router.post(
//   "/blog-image",
//   uploadImage.single("image"),
//   uploadBlogImage,
// );

// export default router;
import { Router } from 'express';

import { requireAdmin } from '../../middlewares/admin.middleware.js';
import { requireAuth } from '../../middlewares/auth.middleware.js';
import { writeLimiter } from '../../middlewares/rateLimiter.middleware.js';
import { uploadImage } from '../../middlewares/upload.middleware.js';

import { mediaController } from './media.controller.js';

const router = Router();

router.post(
  '/blog-image',
  requireAuth,
  requireAdmin,
  writeLimiter,
  uploadImage.single('image'),
  mediaController.uploadBlogImage
);

export default router;
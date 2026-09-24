import { Router } from "express";
import { uploadBlogImage } from "./media.controller";
import { uploadImage } from "../../middlewares/upload.middleware";
// import { uploadImage } from "../../middlewares/upload.middleware.js";
// import { uploadBlogImage } from "./media.controller.js";

const router = Router();

router.post(
  "/blog-image",
  uploadImage.single("image"),
  uploadBlogImage,
);

export default router;
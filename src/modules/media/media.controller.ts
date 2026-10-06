// import { Request, Response } from "express";
// import { uploadImageToCloudinary } from "./media.service.js";

// export const uploadBlogImage = async (
//   req: Request,
//   res: Response,
// ): Promise<void> => {
//   try {
//     if (!req.file) {
//       res.status(400).json({
//         success: false,
//         message: "Image file is required",
//       });

//       return;
//     }

//     const image = await uploadImageToCloudinary(
//       req.file,
//       "dotskills/blog",
//     );

//     res.status(201).json({
//       success: true,
//       message: "Image uploaded successfully",
//       data: image,
//     });
//   } catch (error) {
//     console.error("Image upload error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to upload image",
//     });
//   }
// };
import type { Request, Response } from 'express';

import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

import { uploadImageToCloudinary } from './media.service.js';

export const mediaController = {
  uploadBlogImage: asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw ApiError.badRequest("Image file is required (field name: 'image')");
    }

    const image = await uploadImageToCloudinary(req.file, 'dotskills/blog');

    return ApiResponse.created(res, image, 'Image uploaded successfully');
  }),
};
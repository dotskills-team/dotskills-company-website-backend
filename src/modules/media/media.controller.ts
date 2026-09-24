import { Request, Response } from "express";
import { uploadImageToCloudinary } from "./media.service.js";

export const uploadBlogImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Image file is required",
      });

      return;
    }

    const image = await uploadImageToCloudinary(
      req.file,
      "dotskills/blog",
    );

    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      data: image,
    });
  } catch (error) {
    console.error("Image upload error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload image",
    });
  }
};
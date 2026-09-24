import { UploadApiResponse } from "cloudinary";
import cloudinary from "../../config/cloudinary";
// import cloudinary from "../../config/cloudinary.js";

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export const uploadImageToCloudinary = async (
  file: Express.Multer.File,
  folder: string,
): Promise<UploadedImage> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        const uploaded = result as UploadApiResponse;

        resolve({
          url: uploaded.secure_url,
          publicId: uploaded.public_id,
          width: uploaded.width,
          height: uploaded.height,
          format: uploaded.format,
          bytes: uploaded.bytes,
        });
      },
    );

    uploadStream.end(file.buffer);
  });
};
// import { UploadApiResponse } from "cloudinary";
// import cloudinary from "../../config/cloudinary";
// // import cloudinary from "../../config/cloudinary.js";

// export interface UploadedImage {
//   url: string;
//   publicId: string;
//   width: number;
//   height: number;
//   format: string;
//   bytes: number;
// }

// export const uploadImageToCloudinary = async (
//   file: Express.Multer.File,
//   folder: string,
// ): Promise<UploadedImage> => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder,
//         resource_type: "image",
//         transformation: [
//           {
//             quality: "auto",
//             fetch_format: "auto",
//           },
//         ],
//       },
//       (error, result) => {
//         if (error) {
//           reject(error);
//           return;
//         }

//         if (!result) {
//           reject(new Error("Cloudinary upload failed"));
//           return;
//         }

//         const uploaded = result as UploadApiResponse;

//         resolve({
//           url: uploaded.secure_url,
//           publicId: uploaded.public_id,
//           width: uploaded.width,
//           height: uploaded.height,
//           format: uploaded.format,
//           bytes: uploaded.bytes,
//         });
//       },
//     );

//     uploadStream.end(file.buffer);
//   });
// };
import type { UploadApiResponse } from 'cloudinary';

import cloudinary from '../../config/cloudinary.js';
import { ApiError } from '../../utils/ApiError.js';

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

const uploadFailed = (cause: unknown): ApiError => {
  // log the real reason, but never leak provider details to the client
  console.error('Cloudinary upload error:', cause);
  return new ApiError(502, 'Failed to upload image', {
    code: 'UPLOAD_FAILED',
  });
};

export const uploadImageToCloudinary = (
  file: Express.Multer.File,
  folder: string
): Promise<UploadedImage> =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result?: UploadApiResponse) => {
        if (error || !result) {
          reject(uploadFailed(error ?? new Error('Empty Cloudinary response')));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(file.buffer);
  });
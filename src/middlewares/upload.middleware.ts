// import multer from "multer";

// const allowedMimeTypes = [
//   "image/jpeg",
//   "image/png",
//   "image/webp",
//   "image/gif",
// ];

// const MAX_FILE_SIZE = 5 * 1024 * 1024;

// const storage = multer.memoryStorage();

// export const uploadImage = multer({
//   storage,
//   limits: {
//     fileSize: MAX_FILE_SIZE,
//   },
//   fileFilter: (_req, file, callback) => {
//     if (!allowedMimeTypes.includes(file.mimetype)) {
//       callback(new Error("Only JPEG, PNG, WEBP and GIF images are allowed"));
//       return;
//     }

//     callback(null, true);
//   },
// });
import multer from 'multer';

import { ApiError } from '../utils/ApiError.js';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      callback(
        ApiError.badRequest('Only JPEG, PNG, WEBP and GIF images are allowed')
      );
      return;
    }
    callback(null, true);
  },
});
// import express from "express";
// import cookieParser from "cookie-parser";
// import helmet from "helmet";
// import cors from "cors";
// import authRoutes from "./modules/auth/auth.routes.js";
// import blogRoute from "./modules/blogs/blog.route.js";
// import contactRouter from "./modules/contact/contact.routes.js";
// import mediaRoutes from "./modules/media/media.routes.js";

// const app = express();

// app.use(
//   helmet({
//     crossOriginResourcePolicy: {
//       policy: "cross-origin",
//     },
//   }),
// );

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL ?? "http://localhost:3000",
//     credentials: true,
//   }),
// );

// app.use(express.json({ limit: "1mb" }));
// app.use(express.urlencoded({ extended: true, limit: "1mb" }));
// app.use(cookieParser());

// app.get("/api/v1/health", (_req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "API is healthy",
//   });
// });

// app.use("/api/v1/auth", authRoutes);
// app.use('/api/v1/posts', blogRoute);   
// app.use("/api/v1/media", mediaRoutes);
// app.use('/api/v1/contacts', contactRouter);
// export default app;

import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors, { type CorsOptions } from "cors";
import authRoutes from "./modules/auth/auth.routes.js";
import blogRoute from "./modules/blogs/blog.route.js";
import contactRouter from "./modules/contact/contact.routes.js";
import mediaRoutes from "./modules/media/media.routes.js";

const app = express();

/**
 * Allowed browser origins.
 * FRONTEND_URL can hold ONE or MANY urls separated by commas, e.g.
 *   https://dotskills-company-website.vercel.app,http://localhost:3000
 * Trailing slashes are removed automatically.
 */
const normalizeOrigin = (value: string): string =>
  value.trim().replace(/\/+$/, "");

const allowedOrigins = Array.from(
  new Set(
    [
      ...(process.env.FRONTEND_URL ?? "").split(","),
      "http://localhost:3000",
    ]
      .map(normalizeOrigin)
      .filter(Boolean),
  ),
);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Non-browser tools (curl, server-to-server) send no Origin header
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(normalizeOrigin(origin))) {
      return callback(null, true);
    }

    return callback(null, false); // no CORS headers => browser blocks it
  },
  credentials: true, // required for the refresh-token cookie
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204,
};

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

// CORS must be registered before every route
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // answer all preflight requests

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", blogRoute);
app.use("/api/v1/media", mediaRoutes);
app.use("/api/v1/contacts", contactRouter);

export default app;
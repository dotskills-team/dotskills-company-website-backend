import { Router } from "express";

import {
  createService,
  deleteService,
  getAdminServiceById,
  getAdminServices,
  getPublicServiceBySlug,
  getPublicServices,
  updateService,
} from "./services.controller.js";

import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireAdmin } from "../../middlewares/admin.middleware.js";

const router = Router();

// Public
router.get("/", getPublicServices);

router.get(
  "/admin",
  requireAuth,
  requireAdmin,
  getAdminServices,
);

router.get(
  "/admin/:id",
  requireAuth,
  requireAdmin,
  getAdminServiceById,
);

// Admin mutations
router.post(
  "/",
  requireAuth,
  requireAdmin,
  createService,
);

router.patch(
  "/:id",
  requireAuth,
  requireAdmin,
  updateService,
);

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  deleteService,
);

// Public single service
router.get(
  "/:slug",
  getPublicServiceBySlug,
);

export default router;
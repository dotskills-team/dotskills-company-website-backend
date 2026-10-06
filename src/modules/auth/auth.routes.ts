// import { Router } from "express";
// import {
//   getMe,
//   login,
//   logout,
//   refresh,
//   register,
// } from "./auth.controller.js";
// import { requireAuth } from "../../middlewares/auth.middleware.js";
// // import { requireAuth } from "../../middleware/auth.middleware.js";

// const router = Router();

// router.post("/register", register);

// router.post("/login", login);

// router.post("/refresh", refresh);

// router.post("/logout", logout);

// router.get("/me", requireAuth, getMe);

// export default router;
import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth.middleware.js';
import { authLimiter } from '../../middlewares/rateLimiter.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';

import { authController } from './auth.controller.js';
import { loginSchema, registerSchema } from './auth.validation.js';

const router = Router();

router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  authController.register
);

router.post('/login', authLimiter, validate(loginSchema), authController.login);

router.post('/refresh', authLimiter, authController.refresh);

router.post('/logout', authController.logout);

router.get('/me', requireAuth, authController.getMe);

export default router;
import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { requireAdmin } from '../../middlewares/admin.middleware';
import { requireAuth } from '../../middlewares/auth.middleware';
import { writeLimiter } from '../../middlewares/rateLimiter.middleware';

import {
  createContact,
  deleteContact,
  listContacts,
  updateContactStatus,
} from './contact.controller';

const router = Router();

/** Spam protection for the public form: max 5 submissions per IP per 15 min */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

/** Public route */
router.post('/', contactLimiter, createContact);

/** Protected routes (admin only) */
router.get('/', requireAuth, requireAdmin, listContacts);

router.patch('/:id/status', requireAuth, requireAdmin, writeLimiter, updateContactStatus);

router.delete('/:id', requireAuth, requireAdmin, writeLimiter, deleteContact);

export default router;
import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  createAdminSchema,
  updateAdminSchema,
  updateAdminPasswordSchema,
  adminIdParamSchema,
  userIdParamSchema,
  toggleUserStatusSchema,
  contactMessageIdParamSchema,
} from './admin.schema';
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  updateAdminPassword,
  deleteAdmin,
  getUsers,
  getUserDetail,
  toggleUserStatus,
} from './admin.controller';
import { getAdminStats } from './admin-stats.controller';
import { getContactMessages, markContactMessageTraite } from './admin-contact.controller';

const router = Router();
const adminAuth = authenticateToken(['administrateur']);

// ── Admin management ────────────────────────────────────────
router.get('/admin/admins', adminAuth, getAdmins);
router.post('/admin/admins', adminAuth, validateResource(createAdminSchema), createAdmin);
router.put('/admin/admins/:adminId', adminAuth, validateResource(updateAdminSchema), updateAdmin);
router.put(
  '/admin/admins/:adminId/password',
  adminAuth,
  validateResource(updateAdminPasswordSchema),
  updateAdminPassword,
);
router.delete(
  '/admin/admins/:adminId',
  adminAuth,
  validateResource(adminIdParamSchema),
  deleteAdmin,
);

// ── User management ─────────────────────────────────────────
router.get('/admin/users', adminAuth, getUsers);
router.get('/admin/users/:userId', adminAuth, validateResource(userIdParamSchema), getUserDetail);
router.put(
  '/admin/users/:userId/status',
  adminAuth,
  validateResource(toggleUserStatusSchema),
  toggleUserStatus,
);

// ── Stats ───────────────────────────────────────────────────
router.get('/admin/stats', adminAuth, getAdminStats);

// ── Contact messages management ─────────────────────────────
router.get('/admin/contact-messages', adminAuth, getContactMessages);
router.put(
  '/admin/contact-messages/:messageId/traiter',
  adminAuth,
  validateResource(contactMessageIdParamSchema),
  markContactMessageTraite,
);

export default router;

import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  adminIdParamsSchema,
  createAdminBodySchema,
  updateAdminBodySchema,
  updateAdminPasswordBodySchema,
} from './admin.schema';
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  updateAdminPassword,
  deleteAdmin,
} from './admin.controller';

const router = Router();
const adminAuth = authenticateToken(['administrateur']);

router.get('/admin/admins', adminAuth, getAdmins);
router.post(
  '/admin/admins',
  adminAuth,
  validateResource({ body: createAdminBodySchema }),
  createAdmin,
);
router.put(
  '/admin/admins/:adminId',
  adminAuth,
  validateResource({ params: adminIdParamsSchema, body: updateAdminBodySchema }),
  updateAdmin,
);
router.put(
  '/admin/admins/:adminId/password',
  adminAuth,
  validateResource({ params: adminIdParamsSchema, body: updateAdminPasswordBodySchema }),
  updateAdminPassword,
);
router.delete(
  '/admin/admins/:adminId',
  adminAuth,
  validateResource({ params: adminIdParamsSchema }),
  deleteAdmin,
);

export default router;

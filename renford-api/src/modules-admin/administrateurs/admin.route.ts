import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  createAdminSchema,
  updateAdminSchema,
  updateAdminPasswordSchema,
  adminIdParamSchema,
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

export default router;

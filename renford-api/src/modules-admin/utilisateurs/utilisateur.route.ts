import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import { userIdParamsSchema, toggleUserStatusBodySchema } from './utilisateur.schema';
import { getUsers, getUserDetail, toggleUserStatus } from './utilisateur.controller';

const router = Router();
const adminAuth = authenticateToken(['administrateur']);

router.get('/admin/users', adminAuth, getUsers);
router.get(
  '/admin/users/:userId',
  adminAuth,
  validateResource({ params: userIdParamsSchema }),
  getUserDetail,
);
router.put(
  '/admin/users/:userId/status',
  adminAuth,
  validateResource({ params: userIdParamsSchema, body: toggleUserStatusBodySchema }),
  toggleUserStatus,
);

export default router;

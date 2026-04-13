import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { getCurrentAdmin } from './admin-auth.controller';

const router = Router();

router.get('/admin/me', authenticateToken(['administrateur']), getCurrentAdmin);

export default router;

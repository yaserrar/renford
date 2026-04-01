import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { getAdminStats } from './statistiques.controller';

const router = Router();
const adminAuth = authenticateToken(['administrateur']);

router.get('/admin/stats', adminAuth, getAdminStats);

export default router;

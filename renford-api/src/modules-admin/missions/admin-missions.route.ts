import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { getAdminMissions, getAdminMissionDetail } from './admin-missions.controller';

const router = Router();
const adminAuth = authenticateToken(['administrateur']);

router.get('/admin/missions', adminAuth, getAdminMissions);
router.get('/admin/missions/:missionId', adminAuth, getAdminMissionDetail);

export default router;

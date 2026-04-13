import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import {
  getAdminStats,
  getMissionsByStatus,
  getUsersByStatus,
  getDailyInscriptions,
  getDailyMissions,
} from './statistiques.controller';

const router = Router();
const adminAuth = authenticateToken(['administrateur']);

router.get('/admin/stats', adminAuth, getAdminStats);
router.get('/admin/stats/missions-by-status', adminAuth, getMissionsByStatus);
router.get('/admin/stats/users-by-status', adminAuth, getUsersByStatus);
router.get('/admin/stats/daily-inscriptions', adminAuth, getDailyInscriptions);
router.get('/admin/stats/daily-missions', adminAuth, getDailyMissions);

export default router;

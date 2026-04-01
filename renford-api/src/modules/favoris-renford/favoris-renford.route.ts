import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  addFavori,
  checkFavori,
  getFavoris,
  proposerMission,
  removeFavori,
} from './favoris-renford.controller';
import { profilRenfordIdParamsSchema, proposerMissionBodySchema } from './favoris-renford.schema';

const router = Router();

router.get('/etablissement/favoris', authenticateToken(['etablissement']), getFavoris);

router.get(
  '/etablissement/favoris/:profilRenfordId',
  authenticateToken(['etablissement']),
  validateResource({ params: profilRenfordIdParamsSchema }),
  checkFavori,
);

router.post(
  '/etablissement/favoris/:profilRenfordId',
  authenticateToken(['etablissement']),
  validateResource({ params: profilRenfordIdParamsSchema }),
  addFavori,
);

router.delete(
  '/etablissement/favoris/:profilRenfordId',
  authenticateToken(['etablissement']),
  validateResource({ params: profilRenfordIdParamsSchema }),
  removeFavori,
);

router.post(
  '/etablissement/favoris/:profilRenfordId/proposer-mission',
  authenticateToken(['etablissement']),
  validateResource({ params: profilRenfordIdParamsSchema, body: proposerMissionBodySchema }),
  proposerMission,
);

export default router;

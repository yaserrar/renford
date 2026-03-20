import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  createMission,
  finalizeMissionPayment,
  getEtablissementMissions,
} from './missions.controller';
import {
  createMissionSchema,
  finalizeMissionPaymentSchema,
  getEtablissementMissionsQuerySchema,
  missionIdParamsSchema,
} from './missions.schema';

const router = Router();

router.get(
  '/etablissement/missions',
  authenticateToken(),
  validateResource({ query: getEtablissementMissionsQuerySchema }),
  getEtablissementMissions,
);

router.post(
  '/etablissement/missions',
  authenticateToken(),
  validateResource(createMissionSchema),
  createMission,
);

router.post(
  '/etablissement/missions/:missionId/paiement',
  authenticateToken(),
  validateResource({ params: missionIdParamsSchema, body: finalizeMissionPaymentSchema }),
  finalizeMissionPayment,
);

export default router;

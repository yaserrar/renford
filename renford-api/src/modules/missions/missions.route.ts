import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  createMission,
  finalizeMissionPayment,
  getEtablissementMissionDetails,
  getEtablissementMissions,
  respondToMissionRenfordByEtablissement,
} from './missions.controller';
import {
  createMissionSchema,
  finalizeMissionPaymentSchema,
  getEtablissementMissionsQuerySchema,
  missionIdParamsSchema,
  missionRenfordIdParamsSchema,
  respondToMissionRenfordByEtablissementSchema,
} from './missions.schema';

const router = Router();

router.get(
  '/etablissement/missions',
  authenticateToken(['etablissement']),
  validateResource({ query: getEtablissementMissionsQuerySchema }),
  getEtablissementMissions,
);

router.get(
  '/etablissement/missions/:missionId',
  authenticateToken(['etablissement']),
  validateResource({ params: missionIdParamsSchema }),
  getEtablissementMissionDetails,
);

router.post(
  '/etablissement/missions',
  authenticateToken(['etablissement']),
  validateResource(createMissionSchema),
  createMission,
);

router.post(
  '/etablissement/missions/:missionId/paiement',
  authenticateToken(['etablissement']),
  validateResource({ params: missionIdParamsSchema, body: finalizeMissionPaymentSchema }),
  finalizeMissionPayment,
);

router.post(
  '/etablissement/missions/:missionId/renfords/:missionRenfordId/reponse',
  authenticateToken(['etablissement']),
  validateResource({
    params: missionRenfordIdParamsSchema,
    body: respondToMissionRenfordByEtablissementSchema,
  }),
  respondToMissionRenfordByEtablissement,
);

export default router;

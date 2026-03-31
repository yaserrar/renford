import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  createMission,
  finalizeMissionPayment,
  getEtablissementMissionDetails,
  getEtablissementMissions,
  respondToMissionProposal,
  respondToMissionRenfordByEtablissement,
} from './missions.controller';
import {
  createMissionSchema,
  finalizeMissionPaymentSchema,
  getEtablissementMissionsQuerySchema,
  missionIdParamsSchema,
  missionRenfordIdParamsSchema,
  respondToMissionProposalSchema,
  respondToMissionRenfordByEtablissementSchema,
} from './missions.schema';

const router = Router();

router.get(
  '/etablissement/missions',
  authenticateToken(),
  validateResource({ query: getEtablissementMissionsQuerySchema }),
  getEtablissementMissions,
);

router.get(
  '/etablissement/missions/:missionId',
  authenticateToken(),
  validateResource({ params: missionIdParamsSchema }),
  getEtablissementMissionDetails,
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

router.post(
  '/renford/missions/:missionId/reponse',
  authenticateToken(),
  validateResource({ params: missionIdParamsSchema, body: respondToMissionProposalSchema }),
  respondToMissionProposal,
);

router.post(
  '/etablissement/missions/:missionId/renfords/:missionRenfordId/reponse',
  authenticateToken(),
  validateResource({
    params: missionRenfordIdParamsSchema,
    body: respondToMissionRenfordByEtablissementSchema,
  }),
  respondToMissionRenfordByEtablissement,
);

export default router;

import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  getRenfordMissions,
  getRenfordMissionDetails,
  getRenfordPendingMissionsCount,
  respondToMissionProposal,
} from './missions-renford.controller';
import {
  getRenfordMissionsQuerySchema,
  renfordMissionIdParamsSchema,
  respondToMissionProposalSchema,
} from './missions-renford.schema';

const router = Router();

router.get(
  '/renford/missions/pending-count',
  authenticateToken(['renford']),
  getRenfordPendingMissionsCount,
);

router.get(
  '/renford/missions',
  authenticateToken(['renford']),
  validateResource({ query: getRenfordMissionsQuerySchema }),
  getRenfordMissions,
);

router.get(
  '/renford/missions/:missionId',
  authenticateToken(['renford']),
  validateResource({ params: renfordMissionIdParamsSchema }),
  getRenfordMissionDetails,
);

router.post(
  '/renford/missions/:missionId/reponse',
  authenticateToken(['renford']),
  validateResource({ params: renfordMissionIdParamsSchema, body: respondToMissionProposalSchema }),
  respondToMissionProposal,
);

export default router;

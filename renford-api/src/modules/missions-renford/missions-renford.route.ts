import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  downloadMissionDocumentByRenford,
  getRenfordMissions,
  getRenfordMissionDetails,
  getRenfordPendingMissionsCount,
  respondToMissionProposal,
  signContractByRenford,
  annulerMissionByRenford,
  signalerChangementByRenford,
} from './missions-renford.controller';
import {
  getRenfordMissionsQuerySchema,
  renfordMissionDocumentParamsSchema,
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

router.post(
  '/renford/missions/:missionId/signature',
  authenticateToken(['renford']),
  validateResource({ params: renfordMissionIdParamsSchema }),
  signContractByRenford,
);

router.get(
  '/renford/missions/:missionId/documents/:documentType/download',
  authenticateToken(['renford']),
  validateResource({ params: renfordMissionDocumentParamsSchema }),
  downloadMissionDocumentByRenford,
);

router.post(
  '/renford/missions/:missionId/annuler',
  authenticateToken(['renford']),
  validateResource({ params: renfordMissionIdParamsSchema }),
  annulerMissionByRenford,
);

router.post(
  '/renford/missions/:missionId/signaler-changement',
  authenticateToken(['renford']),
  validateResource({ params: renfordMissionIdParamsSchema }),
  signalerChangementByRenford,
);

export default router;

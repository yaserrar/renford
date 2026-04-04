import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  cancelMissionByEtablissement,
  clotureMissionByEtablissement,
  createMission,
  downloadMissionDocumentByEtablissement,
  finalizeMissionPayment,
  getEtablissementMissionDetails,
  getEtablissementMissions,
  getEtablissementPendingMissionsCount,
  markMissionAsTermineeByEtablissement,
  respondToMissionRenfordByEtablissement,
  signAttestationByEtablissement,
  signContractByEtablissement,
} from './missions.controller';
import {
  createMissionSchema,
  finalizeMissionPaymentSchema,
  getEtablissementMissionsQuerySchema,
  missionDocumentParamsSchema,
  missionIdParamsSchema,
  missionRenfordIdParamsSchema,
  respondToMissionRenfordByEtablissementSchema,
  signMissionDocumentSchema,
} from './missions.schema';

const router = Router();

router.get(
  '/etablissement/missions/pending-count',
  authenticateToken(['etablissement']),
  getEtablissementPendingMissionsCount,
);

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
  '/etablissement/missions/:missionId/terminer',
  authenticateToken(['etablissement']),
  validateResource({ params: missionIdParamsSchema }),
  markMissionAsTermineeByEtablissement,
);

router.post(
  '/etablissement/missions/:missionId/cloturer',
  authenticateToken(['etablissement']),
  validateResource({ params: missionIdParamsSchema }),
  clotureMissionByEtablissement,
);

router.post(
  '/etablissement/missions/:missionId/annuler',
  authenticateToken(['etablissement']),
  validateResource({ params: missionIdParamsSchema }),
  cancelMissionByEtablissement,
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

router.post(
  '/etablissement/missions/:missionId/renfords/:missionRenfordId/signature',
  authenticateToken(['etablissement']),
  validateResource({
    params: missionRenfordIdParamsSchema,
    body: signMissionDocumentSchema,
  }),
  signContractByEtablissement,
);

router.post(
  '/etablissement/missions/:missionId/renfords/:missionRenfordId/attestation/signature',
  authenticateToken(['etablissement']),
  validateResource({
    params: missionRenfordIdParamsSchema,
    body: signMissionDocumentSchema,
  }),
  signAttestationByEtablissement,
);

router.get(
  '/etablissement/missions/:missionId/renfords/:missionRenfordId/documents/:documentType/download',
  authenticateToken(['etablissement']),
  validateResource({ params: missionDocumentParamsSchema }),
  downloadMissionDocumentByEtablissement,
);

export default router;

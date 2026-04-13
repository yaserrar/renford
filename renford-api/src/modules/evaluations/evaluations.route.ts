import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import { createEvaluation, getEvaluation } from './evaluations.controller';
import { createEvaluationSchema, evaluationParamsSchema } from './evaluations.schema';

const router = Router();

// Créer une évaluation (établissement uniquement)
router.post(
  '/etablissement/missions-renford/:missionRenfordId/evaluation',
  authenticateToken(['etablissement']),
  validateResource({ params: evaluationParamsSchema, body: createEvaluationSchema }),
  createEvaluation,
);

// Récupérer l'évaluation d'un missionRenford
router.get(
  '/etablissement/missions-renford/:missionRenfordId/evaluation',
  authenticateToken(['etablissement']),
  validateResource({ params: evaluationParamsSchema }),
  getEvaluation,
);

export default router;

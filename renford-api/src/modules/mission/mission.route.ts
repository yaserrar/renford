import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import { createMission, finalizeMissionPayment } from './mission.controller';
import {
  createMissionSchema,
  finalizeMissionPaymentSchema,
  missionIdParamsSchema,
} from './mission.schema';

const router = Router();

router.post('/', authenticateToken(), validateResource(createMissionSchema), createMission);

router.post(
  '/:missionId/paiement',
  authenticateToken(),
  validateResource({ params: missionIdParamsSchema, body: finalizeMissionPaymentSchema }),
  finalizeMissionPayment,
);

export default router;

import { Router } from 'express';
import { z } from 'zod';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  adminListAbonnements,
  adminGetAbonnement,
  adminSetCompetitionQuote,
  adminCancelAbonnement,
  adminPauseAbonnement,
  adminResumeAbonnement,
  adminUpdateQuota,
} from './admin-abonnements.controller';

const router = Router();
const adminAuth = authenticateToken(['administrateur']);

const abonnementIdParamsSchema = z.object({ abonnementId: z.string() });

const createCompetitionBodySchema = z.object({
  profilEtablissementId: z.string(),
  prixMensuelHT: z.number().positive(),
});

const updateQuotaBodySchema = z.object({
  missionsUtilisees: z.number().int().min(0),
});

router.get('/admin/abonnements', adminAuth, adminListAbonnements);

router.get(
  '/admin/abonnements/:abonnementId',
  adminAuth,
  validateResource({ params: abonnementIdParamsSchema }),
  adminGetAbonnement,
);

router.post(
  '/admin/abonnements/competition',
  adminAuth,
  validateResource({ body: createCompetitionBodySchema }),
  adminSetCompetitionQuote,
);

router.post(
  '/admin/abonnements/:abonnementId/cancel',
  adminAuth,
  validateResource({ params: abonnementIdParamsSchema }),
  adminCancelAbonnement,
);

router.post(
  '/admin/abonnements/:abonnementId/pause',
  adminAuth,
  validateResource({ params: abonnementIdParamsSchema }),
  adminPauseAbonnement,
);

router.post(
  '/admin/abonnements/:abonnementId/resume',
  adminAuth,
  validateResource({ params: abonnementIdParamsSchema }),
  adminResumeAbonnement,
);

router.patch(
  '/admin/abonnements/:abonnementId/quota',
  adminAuth,
  validateResource({ params: abonnementIdParamsSchema, body: updateQuotaBodySchema }),
  adminUpdateQuota,
);

export default router;

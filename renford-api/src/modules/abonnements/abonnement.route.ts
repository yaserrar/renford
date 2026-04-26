import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  createCheckoutSession,
  getCurrentAbonnement,
  getAbonnementHistory,
  cancelAbonnement,
} from './abonnement.controller';
import { handleAbonnementWebhook } from './abonnement.webhook';
import { checkoutBodySchema } from './abonnement.schema';

const router = Router();

// ─── Établissement ────────────────────────────────────────────────────────────

router.post(
  '/abonnements/checkout',
  authenticateToken(['etablissement']),
  validateResource({ body: checkoutBodySchema }),
  createCheckoutSession,
);

router.get('/abonnements/current', authenticateToken(['etablissement']), getCurrentAbonnement);

router.get('/abonnements/history', authenticateToken(['etablissement']), getAbonnementHistory);

router.post('/abonnements/cancel', authenticateToken(['etablissement']), cancelAbonnement);

// ─── Webhook (raw body – mounted separately in app.ts) ────────────────────────

export { handleAbonnementWebhook };

export default router;

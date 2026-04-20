import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  createCheckoutSession,
  createConnectDashboardLink,
  createConnectOnboardingLink,
  getConnectAccountStatus,
  getMissionPaymentStatus,
  getPaymentHistory,
  getPaymentReceiptUrl,
  handleStripeWebhook,
} from './paiement.controller';
import {
  createCheckoutSessionSchema,
  missionIdParamSchema,
  paiementIdParamSchema,
} from './paiement.schema';

const router = Router();

// ─── Renford: Stripe Connect ─────────────────────────────────────────────────

router.post(
  '/paiement/connect/onboarding',
  authenticateToken(['renford']),
  createConnectOnboardingLink,
);

router.get('/paiement/connect/status', authenticateToken(['renford']), getConnectAccountStatus);

router.post(
  '/paiement/connect/dashboard',
  authenticateToken(['renford']),
  createConnectDashboardLink,
);

// ─── Établissement: Checkout ─────────────────────────────────────────────────

router.post(
  '/paiement/checkout',
  authenticateToken(['etablissement']),
  validateResource({ body: createCheckoutSessionSchema }),
  createCheckoutSession,
);

// ─── Shared: Payment info ────────────────────────────────────────────────────

router.get(
  '/paiement/mission/:missionId',
  authenticateToken(['renford', 'etablissement']),
  validateResource({ params: missionIdParamSchema }),
  getMissionPaymentStatus,
);

router.get('/paiement/history', authenticateToken(['renford', 'etablissement']), getPaymentHistory);

router.get(
  '/paiement/:paiementId/facture',
  authenticateToken(['renford', 'etablissement']),
  validateResource({ params: paiementIdParamSchema }),
  getPaymentReceiptUrl,
);

// ─── Webhook (no auth - verified by Stripe signature) ────────────────────────
// NOTE: This route is mounted separately in app.ts with express.raw() body parser

export const webhookHandler = handleStripeWebhook;

export default router;

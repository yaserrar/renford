import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { odooSignWebhookHandler, checkSigningStatus } from './odoo-sign.controller';

const router = Router();

// Webhook endpoint – called by Odoo when a document signing event occurs
router.post('/odoo-sign/webhook', odooSignWebhookHandler);

// Polling endpoint – used by the frontend to check signing status
router.get(
  '/odoo-sign/status/:missionRenfordId/:documentType',
  authenticateToken(),
  checkSigningStatus,
);

export default router;

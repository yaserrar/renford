import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import { getAdminPaiements, getAdminPaymentReceiptUrl } from './admin-paiements.controller';
import { paiementIdParamSchema } from '../../modules/paiement/paiement.schema';

const router = Router();
const adminAuth = authenticateToken(['administrateur']);

router.get('/admin/paiements', adminAuth, getAdminPaiements);

router.get(
  '/admin/paiements/:paiementId/facture',
  adminAuth,
  validateResource({ params: paiementIdParamSchema }),
  getAdminPaymentReceiptUrl,
);

export default router;

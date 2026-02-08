import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import { verifyEmail, resendVerification } from './account-verification.controller';
import { verifyEmailSchema } from './account-verification.schema';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken());

// POST /account-verification/verify-email - Vérifier l'email avec un code
router.post('/verify-email', validateResource(verifyEmailSchema), verifyEmail);

// POST /account-verification/resend-code - Renvoyer le code de vérification
router.post('/resend-code', resendVerification);

export default router;

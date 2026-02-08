import { Router } from 'express';
import {
  login,
  signup,
  verifyEmail,
  resendVerification,
  sendPasswordResetCode,
  validatePasswordResetCode,
  updatePasswordWithCode,
} from './auth.controller';
import { validateResource } from '../../middleware/validate.resource';
import { authenticateToken } from '../../middleware/auth.middleware';
import {
  loginSchema,
  signupSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  passwordResetSendCodeSchema,
  passwordResetValidateCodeSchema,
  passwordResetUpdatePasswordSchema,
} from './auth.schema';

const router = Router();

// ============================================================================
// Inscription (signup)
// ============================================================================

// Inscription simple - le type utilisateur sera défini dans l'onboarding
router.post('/auth/signup', validateResource(signupSchema), signup);

// ============================================================================
// Connexion
// ============================================================================

router.post('/auth/login', validateResource(loginSchema), login);

// ============================================================================
// Vérification email
// ============================================================================

router.post(
  '/auth/verify-email',
  authenticateToken(),
  validateResource(verifyEmailSchema),
  verifyEmail,
);

router.post(
  '/auth/resend-verification',
  validateResource(resendVerificationSchema),
  resendVerification,
);

// ============================================================================
// Réinitialisation mot de passe
// ============================================================================

router.post(
  '/password-reset/send-code',
  validateResource(passwordResetSendCodeSchema),
  sendPasswordResetCode,
);

router.post(
  '/password-reset/validate-code',
  validateResource(passwordResetValidateCodeSchema),
  validatePasswordResetCode,
);

router.post(
  '/password-reset/update-password',
  validateResource(passwordResetUpdatePasswordSchema),
  updatePasswordWithCode,
);

export default router;

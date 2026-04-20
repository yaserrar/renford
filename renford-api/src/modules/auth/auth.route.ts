import { Router } from 'express';
import {
  login,
  signup,
  sendPasswordResetCode,
  validatePasswordResetCode,
  updatePasswordWithCode,
} from './auth.controller';
import { googleAuth, googleAuthSchema } from './google-auth.controller';
import { validateResource } from '../../middleware/validate.resource';
import {
  loginSchema,
  signupSchema,
  passwordResetSendCodeSchema,
  passwordResetValidateCodeSchema,
  passwordResetUpdatePasswordSchema,
} from './auth.schema';

const router = Router();

// ============================================================================
// Inscription (signup)
// ============================================================================

// Inscription simple - email + password uniquement
router.post('/auth/signup', validateResource(signupSchema), signup);

// ============================================================================
// Connexion
// ============================================================================

router.post('/auth/login', validateResource(loginSchema), login);

// ============================================================================
// Authentification Google (Firebase)
// ============================================================================

router.post('/auth/google', validateResource(googleAuthSchema), googleAuth);

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

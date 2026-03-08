import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  changePassword,
  getCurrentUser,
  updateNotificationSettings,
  updateProfile,
} from './utilisateur.controller';
import {
  changePasswordSchema,
  updateNotificationSettingsSchema,
  updateProfileSchema,
} from './utilisateur.schema';

const router = Router();

// Utilisateur connecté (tous les rôles authentifiés)
router.get('/me', authenticateToken(), getCurrentUser);

// Mise à jour du profil
router.put('/profile', authenticateToken(), validateResource(updateProfileSchema), updateProfile);

router.put(
  '/notifications',
  authenticateToken(),
  validateResource(updateNotificationSettingsSchema),
  updateNotificationSettings,
);

// Changement de mot de passe
router.put(
  '/password',
  authenticateToken(),
  validateResource(changePasswordSchema),
  changePassword,
);

export default router;

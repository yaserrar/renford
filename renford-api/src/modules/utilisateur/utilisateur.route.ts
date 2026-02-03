import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import { getCurrentUser, updateProfile, changePassword } from './utilisateur.controller';
import { updateProfileSchema, changePasswordSchema } from './utilisateur.schema';

const router = Router();

// Utilisateur connecté (tous les rôles authentifiés)
router.get('/me', authenticateToken(), getCurrentUser);

// Mise à jour du profil
router.put('/profile', authenticateToken(), validateResource(updateProfileSchema), updateProfile);

// Changement de mot de passe
router.put(
  '/password',
  authenticateToken(),
  validateResource(changePasswordSchema),
  changePassword,
);

export default router;

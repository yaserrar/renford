import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { devResetOnboarding, devResetToStepThree } from './dev.controller';

const router = Router();

// Toutes les routes dev nécessitent une authentification
router.use(authenticateToken());

// POST /dev/reset-onboarding - Supprimer le profil et revenir à l'étape 1
router.post('/reset-onboarding', devResetOnboarding);

// POST /dev/reset-to-step-three - Revenir à l'étape 3 (début du profil)
router.post('/reset-to-step-three', devResetToStepThree);

export default router;

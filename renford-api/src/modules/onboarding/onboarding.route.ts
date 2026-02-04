import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  updateContact,
  updateType,
  updateEtablissement,
  updateFavoris,
  skipStep,
  completeOnboarding,
  getOnboardingStatus,
} from './onboarding.controller';
import {
  updateContactSchema,
  updateTypeSchema,
  updateEtablissementSchema,
  updateFavorisSchema,
  skipStepSchema,
} from './onboarding.schema';

const router = Router();

// Toutes les routes d'onboarding nécessitent une authentification
router.use(authenticateToken());

// GET /onboarding/status - Obtenir le statut de l'onboarding
router.get('/status', getOnboardingStatus);

// PUT /onboarding/contact - Étape 1: Informations de contact
router.put('/contact', validateResource(updateContactSchema), updateContact);

// PUT /onboarding/type - Étape 2: Type d'utilisateur
router.put('/type', validateResource(updateTypeSchema), updateType);

// PUT /onboarding/etablissement - Étape 3: Profil établissement
router.put('/etablissement', validateResource(updateEtablissementSchema), updateEtablissement);

// PUT /onboarding/favoris - Étape 4: Favoris Renfords
router.put('/favoris', validateResource(updateFavorisSchema), updateFavoris);

// POST /onboarding/skip - Passer une étape
router.post('/skip', validateResource(skipStepSchema), skipStep);

// POST /onboarding/complete - Terminer l'onboarding
router.post('/complete', completeOnboarding);

export default router;

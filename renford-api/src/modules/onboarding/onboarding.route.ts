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
  updateRenfordIdentite,
  updateRenfordProfil,
  updateRenfordQualifications,
  updateRenfordBancaire,
  updateRenfordDisponibilites,
  completeRenfordOnboarding,
} from './onboarding.controller';
import {
  updateContactSchema,
  updateTypeSchema,
  updateEtablissementSchema,
  updateFavorisSchema,
  skipStepSchema,
  updateRenfordIdentiteSchema,
  updateRenfordProfilSchema,
  updateRenfordQualificationsSchema,
  updateRenfordBancaireSchema,
  updateRenfordDisponibilitesSchema,
} from './onboarding.schema';

const router = Router();

// Toutes les routes d'onboarding nécessitent une authentification
router.use(authenticateToken());

// GET /onboarding/status - Obtenir le statut de l'onboarding
router.get('/status', getOnboardingStatus);

// ============================================================================
// Routes communes (établissement et renford)
// ============================================================================

// PUT /onboarding/contact - Étape 1: Informations de contact
router.put('/contact', validateResource(updateContactSchema), updateContact);

// PUT /onboarding/type - Étape 2: Type d'utilisateur
router.put('/type', validateResource(updateTypeSchema), updateType);

// ============================================================================
// Routes spécifiques aux établissements
// ============================================================================

// PUT /onboarding/etablissement/profil - Étape 3: Profil établissement
router.put(
  '/etablissement/profil',
  validateResource(updateEtablissementSchema),
  updateEtablissement,
);

// PUT /onboarding/etablissement/favoris - Étape 4: Favoris Renfords
router.put('/etablissement/favoris', validateResource(updateFavorisSchema), updateFavoris);

// POST /onboarding/etablissement/skip - Passer une étape
router.post('/etablissement/skip', validateResource(skipStepSchema), skipStep);

// POST /onboarding/etablissement/complete - Terminer l'onboarding
router.post('/etablissement/complete', completeOnboarding);

// ============================================================================
// Routes spécifiques aux Renfords (8 étapes)
// ============================================================================

// PUT /onboarding/renford/identite - Étape 3: Identité légale Renford
router.put(
  '/renford/identite',
  validateResource(updateRenfordIdentiteSchema),
  updateRenfordIdentite,
);

// PUT /onboarding/renford/profil - Étape 4: Profil Renford
router.put('/renford/profil', validateResource(updateRenfordProfilSchema), updateRenfordProfil);

// PUT /onboarding/renford/qualifications - Étape 5: Qualifications Renford
router.put(
  '/renford/qualifications',
  validateResource(updateRenfordQualificationsSchema),
  updateRenfordQualifications,
);

// PUT /onboarding/renford/bancaire - Étape 6: Infos bancaires Renford
router.put(
  '/renford/bancaire',
  validateResource(updateRenfordBancaireSchema),
  updateRenfordBancaire,
);

// PUT /onboarding/renford/disponibilites - Étape 7: Disponibilités Renford
router.put(
  '/renford/disponibilites',
  validateResource(updateRenfordDisponibilitesSchema),
  updateRenfordDisponibilites,
);

// POST /onboarding/renford/skip - Passer une étape
router.post('/renford/skip', validateResource(skipStepSchema), skipStep);

// POST /onboarding/renford/complete - Terminer l'onboarding Renford (étape 8)
router.post('/renford/complete', completeRenfordOnboarding);

export default router;

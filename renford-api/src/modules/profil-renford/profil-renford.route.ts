import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  updateAvatar,
  updateCouverture,
  updateDiplomesProfil,
  updateDisponibilitesProfil,
  updateDescriptionProfil,
  updateExperiencesProfil,
  updateIdentiteProfil,
  updatePortfolioProfil,
  updateProfilRenford,
  updateQualificationsProfil,
} from './profil-renford.controller';
import {
  updateAvatarSchema,
  updateCouvertureSchema,
  updateDiplomesProfilSchema,
  updateDisponibilitesProfilSchema,
  updateDescriptionProfilSchema,
  updateExperiencesProfilSchema,
  updateIdentiteProfilSchema,
  updatePortfolioProfilSchema,
  updateProfilRenfordSchema,
  updateQualificationsProfilSchema,
} from './profil-renford.schema';

const router = Router();

router.put(
  '/couverture',
  authenticateToken(),
  validateResource(updateCouvertureSchema),
  updateCouverture,
);

router.put('/avatar', authenticateToken(), validateResource(updateAvatarSchema), updateAvatar);

router.put(
  '/',
  authenticateToken(),
  validateResource(updateProfilRenfordSchema),
  updateProfilRenford,
);

router.put(
  '/description',
  authenticateToken(),
  validateResource(updateDescriptionProfilSchema),
  updateDescriptionProfil,
);

router.put(
  '/disponibilites',
  authenticateToken(),
  validateResource(updateDisponibilitesProfilSchema),
  updateDisponibilitesProfil,
);

router.put(
  '/experiences',
  authenticateToken(),
  validateResource(updateExperiencesProfilSchema),
  updateExperiencesProfil,
);

router.put(
  '/diplomes',
  authenticateToken(),
  validateResource(updateDiplomesProfilSchema),
  updateDiplomesProfil,
);

router.put(
  '/portfolio',
  authenticateToken(),
  validateResource(updatePortfolioProfilSchema),
  updatePortfolioProfil,
);

router.put(
  '/qualifications',
  authenticateToken(),
  validateResource(updateQualificationsProfilSchema),
  updateQualificationsProfil,
);

router.put(
  '/identite',
  authenticateToken(),
  validateResource(updateIdentiteProfilSchema),
  updateIdentiteProfil,
);

export default router;

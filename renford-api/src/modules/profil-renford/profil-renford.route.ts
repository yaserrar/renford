import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  getPublicProfilRenford,
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
  profilRenfordIdParamsSchema,
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

router.get(
  '/public/:profilRenfordId',
  authenticateToken(),
  validateResource({ params: profilRenfordIdParamsSchema }),
  getPublicProfilRenford,
);

router.put(
  '/',
  authenticateToken(['renford']),
  validateResource(updateProfilRenfordSchema),
  updateProfilRenford,
);

router.put(
  '/couverture',
  authenticateToken(['renford']),
  validateResource(updateCouvertureSchema),
  updateCouverture,
);

router.put(
  '/avatar',
  authenticateToken(['renford']),
  validateResource(updateAvatarSchema),
  updateAvatar,
);

router.put(
  '/description',
  authenticateToken(['renford']),
  validateResource(updateDescriptionProfilSchema),
  updateDescriptionProfil,
);

router.put(
  '/disponibilites',
  authenticateToken(['renford']),
  validateResource(updateDisponibilitesProfilSchema),
  updateDisponibilitesProfil,
);

router.put(
  '/experiences',
  authenticateToken(['renford']),
  validateResource(updateExperiencesProfilSchema),
  updateExperiencesProfil,
);

router.put(
  '/diplomes',
  authenticateToken(['renford']),
  validateResource(updateDiplomesProfilSchema),
  updateDiplomesProfil,
);

router.put(
  '/portfolio',
  authenticateToken(['renford']),
  validateResource(updatePortfolioProfilSchema),
  updatePortfolioProfil,
);

router.put(
  '/qualifications',
  authenticateToken(['renford']),
  validateResource(updateQualificationsProfilSchema),
  updateQualificationsProfil,
);

router.put(
  '/identite',
  authenticateToken(['renford']),
  validateResource(updateIdentiteProfilSchema),
  updateIdentiteProfil,
);

export default router;

import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  createEtablissementSite,
  updateAvatarProfilEtablissement,
  updateCouvertureProfilEtablissement,
  updateEtablissementSite,
  updateIdentiteProfilEtablissement,
  updateInfosProfilEtablissement,
} from './profil-etablissement.controller';
import {
  createEtablissementSiteSchema,
  updateAvatarProfilEtablissementSchema,
  updateCouvertureProfilEtablissementSchema,
  updateEtablissementSiteSchema,
  updateIdentiteProfilEtablissementSchema,
  updateInfosProfilEtablissementSchema,
} from './profil-etablissement.schema';

const router = Router();

router.put(
  '/couverture',
  authenticateToken(['etablissement']),
  validateResource(updateCouvertureProfilEtablissementSchema),
  updateCouvertureProfilEtablissement,
);

router.put(
  '/avatar',
  authenticateToken(['etablissement']),
  validateResource(updateAvatarProfilEtablissementSchema),
  updateAvatarProfilEtablissement,
);

router.put(
  '/infos',
  authenticateToken(['etablissement']),
  validateResource(updateInfosProfilEtablissementSchema),
  updateInfosProfilEtablissement,
);

router.put(
  '/identite',
  authenticateToken(['etablissement']),
  validateResource(updateIdentiteProfilEtablissementSchema),
  updateIdentiteProfilEtablissement,
);

router.post(
  '/etablissements',
  authenticateToken(['etablissement']),
  validateResource(createEtablissementSiteSchema),
  createEtablissementSite,
);

router.put(
  '/etablissements/:etablissementId',
  authenticateToken(['etablissement']),
  validateResource(updateEtablissementSiteSchema),
  updateEtablissementSite,
);

export default router;

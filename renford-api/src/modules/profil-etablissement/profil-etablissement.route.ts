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
  authenticateToken(),
  validateResource(updateCouvertureProfilEtablissementSchema),
  updateCouvertureProfilEtablissement,
);

router.put(
  '/avatar',
  authenticateToken(),
  validateResource(updateAvatarProfilEtablissementSchema),
  updateAvatarProfilEtablissement,
);

router.put(
  '/infos',
  authenticateToken(),
  validateResource(updateInfosProfilEtablissementSchema),
  updateInfosProfilEtablissement,
);

router.put(
  '/identite',
  authenticateToken(),
  validateResource(updateIdentiteProfilEtablissementSchema),
  updateIdentiteProfilEtablissement,
);

router.post(
  '/etablissements',
  authenticateToken(),
  validateResource(createEtablissementSiteSchema),
  createEtablissementSite,
);

router.put(
  '/etablissements/:etablissementId',
  authenticateToken(),
  validateResource(updateEtablissementSiteSchema),
  updateEtablissementSite,
);

export default router;

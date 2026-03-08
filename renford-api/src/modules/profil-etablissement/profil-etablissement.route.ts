import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  updateAvatarProfilEtablissement,
  updateCouvertureProfilEtablissement,
  updateIdentiteProfilEtablissement,
  updateInfosProfilEtablissement,
} from './profil-etablissement.controller';
import {
  updateAvatarProfilEtablissementSchema,
  updateCouvertureProfilEtablissementSchema,
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

export default router;

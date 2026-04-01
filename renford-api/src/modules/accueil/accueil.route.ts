import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { getEtablissementAccueil, getRenfordAccueil } from './accueil.controller';

const router = Router();

router.get('/etablissement/accueil', authenticateToken(['etablissement']), getEtablissementAccueil);

router.get('/renford/accueil', authenticateToken(['renford']), getRenfordAccueil);

export default router;

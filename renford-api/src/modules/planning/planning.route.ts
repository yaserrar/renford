import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import {
  getEtablissementPlanning,
  getRenfordPlanning,
  getIndisponibilites,
  createIndisponibilite,
  deleteIndisponibilite,
} from './planning.controller';

const router = Router();

router.get(
  '/etablissement/planning',
  authenticateToken(['etablissement']),
  getEtablissementPlanning,
);

router.get('/renford/planning', authenticateToken(['renford']), getRenfordPlanning);

router.get('/renford/indisponibilites', authenticateToken(['renford']), getIndisponibilites);

router.post('/renford/indisponibilites', authenticateToken(['renford']), createIndisponibilite);

router.delete(
  '/renford/indisponibilites/:indisponibiliteId',
  authenticateToken(['renford']),
  deleteIndisponibilite,
);

export default router;

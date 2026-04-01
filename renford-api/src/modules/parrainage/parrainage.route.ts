import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { inviterRenford, getFilleuls } from './parrainage.controller';

const router = Router();

// Both renford and etablissement can invite
router.post('/parrainage/inviter', authenticateToken(['renford', 'etablissement']), inviterRenford);

// Both can see their filleuls
router.get('/parrainage/filleuls', authenticateToken(['renford', 'etablissement']), getFilleuls);

export default router;

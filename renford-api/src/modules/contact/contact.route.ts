import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import { createContactMessageSchema } from './contact.schema';
import { createContactMessage } from './contact.controller';

const router = Router();

router.post(
  '/contact',
  authenticateToken(['etablissement', 'renford']),
  validateResource(createContactMessageSchema),
  createContactMessage,
);

export default router;

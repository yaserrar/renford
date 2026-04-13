import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import { contactMessageIdParamsSchema } from './messages-contact.schema';
import { getContactMessages, markContactMessageTraite } from './messages-contact.controller';

const router = Router();
const adminAuth = authenticateToken(['administrateur']);

router.get('/admin/contact-messages', adminAuth, getContactMessages);
router.put(
  '/admin/contact-messages/:messageId/traiter',
  adminAuth,
  validateResource({ params: contactMessageIdParamsSchema }),
  markContactMessageTraite,
);

export default router;

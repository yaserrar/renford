import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import { emailTemplateTypeParamSchema, upsertEmailTemplateSchema } from './email-templates.schema';
import {
  listEmailTemplates,
  getEmailTemplate,
  upsertEmailTemplate,
  resetEmailTemplate,
} from './email-templates.controller';

const router = Router();
const adminAuth = authenticateToken(['administrateur']);

router.get('/admin/email-templates', adminAuth, listEmailTemplates);
router.get(
  '/admin/email-templates/:type',
  adminAuth,
  validateResource({ params: emailTemplateTypeParamSchema }),
  getEmailTemplate,
);
router.put(
  '/admin/email-templates/:type',
  adminAuth,
  validateResource({ params: emailTemplateTypeParamSchema, body: upsertEmailTemplateSchema }),
  upsertEmailTemplate,
);
router.delete(
  '/admin/email-templates/:type',
  adminAuth,
  validateResource({ params: emailTemplateTypeParamSchema }),
  resetEmailTemplate,
);

export default router;

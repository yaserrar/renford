import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  getNotificationsQuerySchema,
  notificationIdParamsSchema,
} from '../../modules/notifications/notifications.schema';
import {
  getAdminNotifications,
  getAdminUnreadCount,
  markAllAdminNotificationsRead,
  markOneAdminNotificationAsRead,
} from './notifications.controller';

const router = Router();
const adminAuth = authenticateToken(['administrateur']);

router.get(
  '/admin/notifications',
  adminAuth,
  validateResource({ query: getNotificationsQuerySchema }),
  getAdminNotifications,
);

router.get('/admin/notifications/unread-count', adminAuth, getAdminUnreadCount);

router.patch(
  '/admin/notifications/:notificationId/read',
  adminAuth,
  validateResource({ params: notificationIdParamsSchema }),
  markOneAdminNotificationAsRead,
);

router.patch('/admin/notifications/read-all', adminAuth, markAllAdminNotificationsRead);

export default router;

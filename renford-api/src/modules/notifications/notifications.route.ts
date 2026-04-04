import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { validateResource } from '../../middleware/validate.resource';
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  markOneNotificationAsRead,
} from './notifications.controller';
import { getNotificationsQuerySchema, notificationIdParamsSchema } from './notifications.schema';

const router = Router();

router.get(
  '/notifications',
  authenticateToken(['etablissement', 'renford']),
  validateResource({ query: getNotificationsQuerySchema }),
  getNotifications,
);

router.get(
  '/notifications/unread-count',
  authenticateToken(['etablissement', 'renford']),
  getUnreadCount,
);

router.patch(
  '/notifications/:notificationId/read',
  authenticateToken(['etablissement', 'renford']),
  validateResource({ params: notificationIdParamsSchema }),
  markOneNotificationAsRead,
);

router.patch(
  '/notifications/read-all',
  authenticateToken(['etablissement', 'renford']),
  markAllNotificationsRead,
);

export default router;

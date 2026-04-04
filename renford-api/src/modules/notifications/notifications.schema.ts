import { z } from 'zod';

export const getNotificationsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(10).optional(),
});

export const notificationIdParamsSchema = z.object({
  notificationId: z.string().uuid("L'identifiant de notification est invalide"),
});

export type GetNotificationsQuerySchema = z.infer<typeof getNotificationsQuerySchema>;
export type NotificationIdParamsSchema = z.infer<typeof notificationIdParamsSchema>;

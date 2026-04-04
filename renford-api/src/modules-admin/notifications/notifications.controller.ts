import type { NextFunction, Request, Response } from 'express';
import type {
  GetNotificationsQuerySchema,
  NotificationIdParamsSchema,
} from '../../modules/notifications/notifications.schema';
import {
  getUnreadNotificationsCount,
  getUserNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../../modules/notifications/notifications.service';

export const getAdminNotifications = async (
  req: Request<unknown, unknown, unknown, GetNotificationsQuerySchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const utilisateur = req.utilisateur;
    if (!utilisateur) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const result = await getUserNotifications({
      utilisateurId: utilisateur.id,
      utilisateurType: utilisateur.typeUtilisateur,
      page: Number.isFinite(page) && page > 0 ? Math.trunc(page) : 1,
      limit: Number.isFinite(limit) && limit > 0 ? Math.min(50, Math.trunc(limit)) : 10,
    });

    return res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const markOneAdminNotificationAsRead = async (
  req: Request<NotificationIdParamsSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const utilisateurId = req.userId!;
    const result = await markNotificationAsRead({
      notificationId: req.params.notificationId,
      utilisateurId,
    });

    if (result.updatedCount === 0) {
      return res.status(404).json({ message: 'Notification introuvable' });
    }

    return res.json({ message: 'Notification marquée comme lue' });
  } catch (err) {
    return next(err);
  }
};

export const markAllAdminNotificationsRead = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const utilisateurId = req.userId!;
    const result = await markAllNotificationsAsRead(utilisateurId);

    return res.json({
      message: 'Toutes les notifications ont été marquées comme lues',
      updatedCount: result.updatedCount,
    });
  } catch (err) {
    return next(err);
  }
};

export const getAdminUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const utilisateurId = req.userId!;
    const result = await getUnreadNotificationsCount(utilisateurId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
};

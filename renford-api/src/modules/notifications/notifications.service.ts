import type { Notification, TypeUtilisateur } from '@prisma/client';
import prisma from '../../config/prisma';

type NotificationWithTarget = Notification & {
  targetPath: string | null;
};

const buildTargetPath = (
  notification: Pick<Notification, 'source' | 'sourceId'>,
  utilisateurType: TypeUtilisateur,
  missionIdByMissionRenfordId: Map<string, string>,
): string | null => {
  if (!notification.sourceId) return null;

  if (notification.source === 'missions') {
    if (utilisateurType === 'etablissement') {
      return `/dashboard/etablissement/missions/${notification.sourceId}`;
    }

    if (utilisateurType === 'renford') {
      return `/dashboard/renford/missions/${notification.sourceId}`;
    }

    return `/admin/accueil`;
  }

  if (notification.source === 'mission_renfords') {
    const missionId = missionIdByMissionRenfordId.get(notification.sourceId);
    if (!missionId) return null;

    if (utilisateurType === 'renford') {
      return `/dashboard/renford/missions/${missionId}`;
    }

    if (utilisateurType === 'etablissement') {
      return `/dashboard/etablissement/missions/${missionId}`;
    }
  }

  return null;
};

export const getUserNotifications = async (params: {
  utilisateurId: string;
  utilisateurType: TypeUtilisateur;
  page: number;
  limit: number;
}): Promise<{
  data: NotificationWithTarget[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const safePage = Number.isFinite(params.page) && params.page > 0 ? Math.trunc(params.page) : 1;
  const safeLimit =
    Number.isFinite(params.limit) && params.limit > 0 ? Math.min(50, Math.trunc(params.limit)) : 10;
  const skip = (safePage - 1) * safeLimit;

  const [total, notifications] = await Promise.all([
    prisma.notification.count({ where: { utilisateurId: params.utilisateurId } }),
    prisma.notification.findMany({
      where: { utilisateurId: params.utilisateurId },
      orderBy: [{ lu: 'asc' }, { dateCreation: 'desc' }],
      skip,
      take: safeLimit,
    }),
  ]);

  const missionRenfordIds = notifications
    .filter((n) => n.source === 'mission_renfords' && n.sourceId)
    .map((n) => n.sourceId as string);

  const missionRenfords =
    missionRenfordIds.length > 0
      ? await prisma.missionRenford.findMany({
          where: { id: { in: missionRenfordIds } },
          select: { id: true, missionId: true },
        })
      : [];

  const missionIdByMissionRenfordId = new Map(
    missionRenfords.map((missionRenford) => [missionRenford.id, missionRenford.missionId]),
  );

  const data = notifications.map((notification) => ({
    ...notification,
    targetPath: buildTargetPath(notification, params.utilisateurType, missionIdByMissionRenfordId),
  }));

  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return {
    data,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
    },
  };
};

export const markNotificationAsRead = async (params: {
  notificationId: string;
  utilisateurId: string;
}) => {
  const updated = await prisma.notification.updateMany({
    where: {
      id: params.notificationId,
      utilisateurId: params.utilisateurId,
      lu: false,
    },
    data: {
      lu: true,
    },
  });

  return { updatedCount: updated.count };
};

export const markAllNotificationsAsRead = async (utilisateurId: string) => {
  const updated = await prisma.notification.updateMany({
    where: {
      utilisateurId,
      lu: false,
    },
    data: {
      lu: true,
    },
  });

  return { updatedCount: updated.count };
};

export const getUnreadNotificationsCount = async (utilisateurId: string) => {
  const count = await prisma.notification.count({
    where: {
      utilisateurId,
      lu: false,
    },
  });

  return { count };
};

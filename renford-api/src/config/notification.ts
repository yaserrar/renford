import type { SourceNotification } from '@prisma/client';
import prisma from './prisma';

type CreateNotificationInput = {
  utilisateurId: string;
  source: SourceNotification;
  sourceId?: string | null;
  titre: string;
  description: string;
};

export const createNotification = async (input: CreateNotificationInput) => {
  return prisma.notification.create({
    data: {
      utilisateurId: input.utilisateurId,
      titre: input.titre,
      description: input.description,
      source: input.source,
      sourceId: input.sourceId ?? null,
    },
  });
};

export const createNotifications = async (inputs: CreateNotificationInput[]) => {
  if (inputs.length === 0) return;

  await prisma.notification.createMany({
    data: inputs.map((input) => ({
      utilisateurId: input.utilisateurId,
      titre: input.titre,
      description: input.description,
      source: input.source,
      sourceId: input.sourceId ?? null,
    })),
  });
};

import prisma from '../config/prisma';
import { mail } from '../config/mail';
import { logger } from '../config/logger';
import { env } from '../config/env';
import { getIncompleteRenfordProfileReminderEmail } from '../config/email-templates';

export const sendIncompleteRenfordProfileReminders = async (): Promise<{
  candidates: number;
  sent: number;
  failed: number;
}> => {
  const candidates = await prisma.utilisateur.findMany({
    where: {
      typeUtilisateur: 'renford',
      emailVerifie: true,
      statut: { in: ['onboarding', 'actif'] },
      etapeOnboarding: { gt: 0, lt: 8 },
    },
    select: {
      id: true,
      email: true,
      prenom: true,
    },
  });

  let sent = 0;
  let failed = 0;

  for (const user of candidates) {
    const emailPayload = getIncompleteRenfordProfileReminderEmail({
      prenom: user.prenom ?? '',
      dashboardUrl: `${env.PLATFORM_URL}/onboarding`,
    });

    try {
      await mail.sendMail({
        to: user.email,
        subject: emailPayload.subject,
        html: emailPayload.html,
        text: emailPayload.text,
      });
      sent += 1;
    } catch (err) {
      failed += 1;
      logger.error(
        { err, userId: user.id, email: user.email },
        "Echec d'envoi de l'email de rappel profil Renford incomplet",
      );
    }
  }

  return {
    candidates: candidates.length,
    sent,
    failed,
  };
};

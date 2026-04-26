import { Resend } from 'resend';
import { prisma } from './prisma';
import { env } from './env';
import { logger } from './logger';
import { isOdooSmsEnabled, sendSmsViaOdooSafe } from './odoo-sms';
import { buildSmsEquivalentMessage, normalizePhoneNumber } from '../lib/sms-equivalent';

// import nodemailer from 'nodemailer';
// export const mail = nodemailer.createTransport({
//   service: env.EMAIL_SERVICE,
//   host: env.EMAIL_HOST,
//   port: 465,
//   secure: true,
//   auth: {
//     user: env.EMAIL_HOST_USER,
//     pass: env.EMAIL_HOST_PASSWORD,
//   },
// });

const resend = new Resend(env.RESEND_API_KEY);

type SendMailInput = {
  to: string | string[];
  from?: string;
  subject: string;
  text?: string;
  html?: string;
};

const getRecipientEmails = (to: string | string[]) => {
  const recipients = Array.isArray(to) ? to : [to];
  return recipients.map((value) => value.trim().toLowerCase()).filter(Boolean);
};

const getRecipientFilters = (emails: string[]) =>
  emails.map((email) => ({ email: { equals: email, mode: 'insensitive' as const } }));

const resolveRecipientPhones = async (emails: string[]) => {
  if (!emails.length) {
    return [];
  }

  const users = await prisma.utilisateur.findMany({
    where: {
      OR: getRecipientFilters(emails),
    },
    select: {
      telephone: true,
    },
  });

  const phones = users.map((user) => user.telephone);

  const normalized = phones
    .map((phone) => normalizePhoneNumber(phone))
    .filter((phone): phone is string => Boolean(phone));

  return Array.from(new Set(normalized));
};

const sendSmsEquivalentForEmail = async ({ to, subject, text, html }: SendMailInput) => {
  if (!isOdooSmsEnabled()) {
    return;
  }

  const recipientEmails = getRecipientEmails(to);

  if (!recipientEmails.length) {
    return;
  }

  const recipientPhones = await resolveRecipientPhones(recipientEmails);

  if (!recipientPhones.length) {
    logger.info(
      {
        recipientEmails,
        subject,
      },
      'No phone number found for SMS equivalent',
    );
    return;
  }

  const smsMessage = buildSmsEquivalentMessage({
    subject,
    text,
    html,
    maxLength: Number(process.env.ODOO_SMS_MAX_LENGTH || 320),
  });

  await Promise.all(
    recipientPhones.map((phone) =>
      sendSmsViaOdooSafe({
        to: phone,
        message: smsMessage,
        metadata: {
          source: 'email-equivalent',
          subject,
          recipientEmails,
        },
      }),
    ),
  );
};

export const mail = {
  sendMail: async ({ to, from, subject, text, html }: SendMailInput) => {
    await resend.emails.send({
      from: from || `L'equipe Renford <${env.EMAIL_HOST_USER}>`,
      to,
      subject,
      text: text || ' ',
      ...(html ? { html } : {}),
    });

    try {
      await sendSmsEquivalentForEmail({ to, from, subject, text, html });
    } catch (error) {
      logger.warn(
        {
          err: error,
          subject,
        },
        'SMS equivalent dispatch failed after email send',
      );
    }
  },
};

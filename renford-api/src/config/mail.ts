import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { env } from './env';

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

sgMail.setApiKey(env.SENDGRID_API_KEY);

type SendMailInput = {
  to: string | string[];
  from?: string;
  subject: string;
  text?: string;
  html?: string;
};

export const mail = {
  sendMail: async ({ to, from, subject, text, html }: SendMailInput) => {
    const payload: MailDataRequired = {
      to,
      from: from || env.EMAIL_HOST_USER,
      subject,
      text: text || ' ',
      ...(html ? { html } : {}),
    };

    await sgMail.send(payload);
  },
};

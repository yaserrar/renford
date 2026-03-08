import { Resend } from 'resend';
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

const resend = new Resend(env.RESEND_API_KEY);

type SendMailInput = {
  to: string | string[];
  from?: string;
  subject: string;
  text?: string;
  html?: string;
};

export const mail = {
  sendMail: async ({ to, from, subject, text, html }: SendMailInput) => {
    await resend.emails.send({
      from: from || env.EMAIL_HOST_USER,
      to,
      subject,
      text: text || ' ',
      ...(html ? { html } : {}),
    });
  },
};

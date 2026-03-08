import nodemailer from 'nodemailer';
import { env } from './env';

export const mail = nodemailer.createTransport({
  service: env.EMAIL_SERVICE,
  host: env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: env.EMAIL_HOST_USER,
    pass: env.EMAIL_HOST_PASSWORD,
  },
});

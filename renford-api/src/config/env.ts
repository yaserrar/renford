import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  CORS_ORIGIN: z.string().default('*'),
  DATABASE_URL: z
    .string()
    .url('DATABASE_URL must be a valid MongoDB connection string')
    .default('mongodb://localhost:27017/morocco-reading'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required').default('your-secret-key'),

  EMAIL_SERVICE: z.string().default('Gmail'),
  EMAIL_HOST: z.string().default('smtp.gmail.com'),
  EMAIL_HOST_USER: z.string({ required_error: 'EMAIL_HOST_USER is required' }),
  EMAIL_HOST_PASSWORD: z.string().optional(),
  RESEND_API_KEY: z.string({ required_error: 'RESEND_API_KEY is required' }),
  PLATFORM_URL: z.string().url().default('https://test.renford.store'),

  // Stripe
  STRIPE_SECRET_KEY: z.string({ required_error: 'STRIPE_SECRET_KEY is required' }),
  STRIPE_WEBHOOK_SECRET: z.string({ required_error: 'STRIPE_WEBHOOK_SECRET is required' }),
  STRIPE_COMMISSION_PERCENT: z.coerce.number().min(0).max(100).default(15),
  COACH_FEE_HT: z.coerce.number().min(0).default(375),

  // Firebase
  FIREBASE_PROJECT_ID: z.string({ required_error: 'FIREBASE_PROJECT_ID is required' }),
  FIREBASE_CLIENT_EMAIL: z.string({ required_error: 'FIREBASE_CLIENT_EMAIL is required' }),
  FIREBASE_PRIVATE_KEY: z.string({ required_error: 'FIREBASE_PRIVATE_KEY is required' }),

  // MinIO
  MINIO_ENDPOINT: z.string().default('localhost'),
  MINIO_PORT: z.coerce.number().int().positive().default(9000),
  MINIO_ACCESS_KEY: z.string().default('minioadmin'),
  MINIO_SECRET_KEY: z.string().default('minioadmin'),
  MINIO_BUCKET: z.string().default('renford'),
  MINIO_USE_SSL: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

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
  EMAIL_HOST_PASSWORD: z.string({ required_error: 'EMAIL_HOST_PASSWORD is required' }),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

import { z } from 'zod';
import { file } from 'zod/v4';

export const uploadSchema = z.object({
  file: z.any(),
  path: z
    .string()
    .min(1, 'Upload path is required')
    .regex(/^[a-zA-Z0-9/_-]+$/, 'Invalid upload path'),
  name: z.string().optional(),
});

export type UploadSchema = z.infer<typeof uploadSchema>;

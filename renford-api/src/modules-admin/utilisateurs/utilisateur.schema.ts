import { z } from 'zod';

export const userIdParamSchema = z.object({
  params: z.object({ userId: z.string().uuid() }),
});

export const toggleUserStatusSchema = z.object({
  params: z.object({ userId: z.string().uuid() }),
  body: z.object({
    statut: z.enum(['actif', 'suspendu']),
  }),
});

export type ToggleUserStatusSchema = z.infer<typeof toggleUserStatusSchema>;

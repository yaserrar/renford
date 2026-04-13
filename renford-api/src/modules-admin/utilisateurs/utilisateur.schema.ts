import { z } from 'zod';

export const userIdParamsSchema = z.object({ userId: z.string().uuid() });

export const toggleUserStatusBodySchema = z.object({
  statut: z.enum(['actif', 'suspendu']),
});

export type ToggleUserStatusBody = z.infer<typeof toggleUserStatusBodySchema>;

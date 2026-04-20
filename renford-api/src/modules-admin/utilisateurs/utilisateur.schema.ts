import { z } from 'zod';

export const userIdParamsSchema = z.object({ userId: z.string().uuid() });

export const toggleUserStatusBodySchema = z.object({
  statut: z.enum(['actif', 'suspendu']),
});

export const diplomeIdParamsSchema = z.object({
  diplomeId: z.string().uuid(),
});

export const toggleDiplomeVerificationBodySchema = z.object({
  verifie: z.boolean(),
});

export type ToggleUserStatusBody = z.infer<typeof toggleUserStatusBodySchema>;
export type ToggleDiplomeVerificationBody = z.infer<typeof toggleDiplomeVerificationBodySchema>;

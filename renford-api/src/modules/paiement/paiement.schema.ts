import { z } from 'zod';

export const createCheckoutSessionSchema = z.object({
  missionId: z.string().uuid("L'identifiant de mission est invalide"),
});

export const missionIdParamSchema = z.object({
  missionId: z.string().uuid("L'identifiant de mission est invalide"),
});

export type CreateCheckoutSessionSchema = z.infer<typeof createCheckoutSessionSchema>;
export type MissionIdParamSchema = z.infer<typeof missionIdParamSchema>;

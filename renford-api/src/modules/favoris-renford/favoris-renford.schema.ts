import { z } from 'zod';

export const profilRenfordIdParamsSchema = z.object({
  profilRenfordId: z.string().uuid("L'identifiant du profil Renford est invalide"),
});

export const proposerMissionBodySchema = z.object({
  missionId: z.string().uuid("L'identifiant de la mission est invalide"),
});

export type ProfilRenfordIdParamsSchema = z.infer<typeof profilRenfordIdParamsSchema>;
export type ProposerMissionBodySchema = z.infer<typeof proposerMissionBodySchema>;

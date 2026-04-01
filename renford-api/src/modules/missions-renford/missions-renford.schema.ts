import { z } from 'zod';

export const RENFORD_MISSIONS_TAB = ['opportunites', 'candidatures', 'validees'] as const;
export type RenfordMissionsTab = (typeof RENFORD_MISSIONS_TAB)[number];

export const getRenfordMissionsQuerySchema = z.object({
  tab: z
    .enum(RENFORD_MISSIONS_TAB, {
      required_error: 'Veuillez préciser un onglet valide',
    })
    .optional(),
});

export const renfordMissionIdParamsSchema = z.object({
  missionId: z.string().uuid("L'identifiant de mission est invalide"),
});

export const respondToMissionProposalSchema = z.object({
  response: z.enum(['selection_en_cours', 'refuse_par_renford'], {
    required_error: 'Veuillez préciser une réponse valide',
  }),
});

export type GetRenfordMissionsQuerySchema = z.infer<typeof getRenfordMissionsQuerySchema>;
export type RenfordMissionIdParamsSchema = z.infer<typeof renfordMissionIdParamsSchema>;
export type RespondToMissionProposalSchema = z.infer<typeof respondToMissionProposalSchema>;

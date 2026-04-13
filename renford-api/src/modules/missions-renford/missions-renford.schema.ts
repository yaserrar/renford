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

export const signMissionDocumentSchema = z.object({
  documentType: z.enum(['contrat_prestation', 'attestation_mission'], {
    required_error: 'Veuillez préciser le type de document',
  }),
});

export const renfordMissionDocumentParamsSchema = z.object({
  missionId: z.string().uuid("L'identifiant de mission est invalide"),
  documentType: z.enum([
    'facture_prestation',
    'facture_commission',
    'contrat_prestation',
    'attestation_mission',
  ]),
});

export type GetRenfordMissionsQuerySchema = z.infer<typeof getRenfordMissionsQuerySchema>;
export type RenfordMissionIdParamsSchema = z.infer<typeof renfordMissionIdParamsSchema>;
export type RespondToMissionProposalSchema = z.infer<typeof respondToMissionProposalSchema>;
export type SignMissionDocumentSchema = z.infer<typeof signMissionDocumentSchema>;
export type RenfordMissionDocumentParamsSchema = z.infer<typeof renfordMissionDocumentParamsSchema>;

import { z } from 'zod';

export const createEvaluationSchema = z.object({
  note: z.number().int().min(1).max(5),
  commentaire: z.string().max(1000).optional(),
});

export type CreateEvaluationSchema = z.infer<typeof createEvaluationSchema>;

export const evaluationParamsSchema = z.object({
  missionRenfordId: z.string().uuid(),
});

export type EvaluationParamsSchema = z.infer<typeof evaluationParamsSchema>;

import { z } from 'zod';

export const checkoutBodySchema = z.object({
  plan: z.enum(['echauffement', 'performance', 'competition']),
});

export const abonnementIdParamSchema = z.object({
  abonnementId: z.string().uuid(),
});

export type CheckoutBodySchema = z.infer<typeof checkoutBodySchema>;
export type AbonnementIdParamSchema = z.infer<typeof abonnementIdParamSchema>;

export const PLAN_QUOTA_MAP: Record<'echauffement' | 'performance' | 'competition', number> = {
  echauffement: 10,
  performance: 25,
  competition: 0, // unlimited
};

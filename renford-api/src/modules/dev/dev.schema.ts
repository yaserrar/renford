import { z } from 'zod';

// Pas de body nécessaire pour ces endpoints dev
// Les deux actions utilisent uniquement le userId du token JWT

export const devResetOnboardingSchema = z.object({});
export type DevResetOnboardingSchema = z.infer<typeof devResetOnboardingSchema>;

export const devResetToStepThreeSchema = z.object({});
export type DevResetToStepThreeSchema = z.infer<typeof devResetToStepThreeSchema>;

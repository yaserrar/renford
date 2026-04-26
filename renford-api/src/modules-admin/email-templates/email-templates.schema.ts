import { z } from 'zod';
import { TypeEmailTemplate } from '@prisma/client';

export const emailTemplateTypeParamSchema = z.object({
  type: z.nativeEnum(TypeEmailTemplate),
});

export const upsertEmailTemplateSchema = z.object({
  sujet: z.string().max(300).nullable().optional(),
  titre: z.string().max(300).nullable().optional(),
  intro: z.string().max(2000).nullable().optional(),
  corps: z.string().max(5000).nullable().optional(),
  closing: z.string().max(1000).nullable().optional(),
  ctaLabel: z.string().max(100).nullable().optional(),
  actif: z.boolean().optional(),
});

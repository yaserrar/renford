import { z } from 'zod';

export const createContactMessageSchema = z.object({
  sujet: z
    .string({ required_error: 'Le sujet est obligatoire' })
    .min(1, 'Le sujet est obligatoire')
    .max(200, '200 caractères maximum'),
  texte: z
    .string({ required_error: 'Le message est obligatoire' })
    .min(1, 'Le message est obligatoire')
    .max(5000, '5000 caractères maximum'),
});

export type CreateContactMessageSchema = z.infer<typeof createContactMessageSchema>;

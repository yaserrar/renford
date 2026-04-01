import { z } from 'zod';

export const inviteRenfordSchema = z.object({
  nom: z
    .string({ required_error: 'Le nom est obligatoire' })
    .min(1, 'Le nom est obligatoire')
    .max(100, '100 caractères maximum'),
  prenom: z
    .string({ required_error: 'Le prénom est obligatoire' })
    .min(1, 'Le prénom est obligatoire')
    .max(100, '100 caractères maximum'),
  email: z
    .string({ required_error: "L'email est obligatoire" })
    .email({ message: "L'email est invalide" })
    .max(250, '250 caractères maximum'),
});

export type InviteRenfordSchema = z.infer<typeof inviteRenfordSchema>;

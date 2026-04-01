import { z } from 'zod';

export const createAdminSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "L'email est obligatoire" })
      .email({ message: "L'email est invalide" })
      .max(250, '250 caractères maximum'),
    password: z
      .string({ required_error: 'Le mot de passe est obligatoire' })
      .min(8, { message: '8 caractères minimum' }),
    nom: z
      .string({ required_error: 'Le nom est obligatoire' })
      .min(1, 'Le nom est obligatoire')
      .max(100, '100 caractères maximum'),
    prenom: z
      .string({ required_error: 'Le prénom est obligatoire' })
      .min(1, 'Le prénom est obligatoire')
      .max(100, '100 caractères maximum'),
  }),
});

export type CreateAdminSchema = z.infer<typeof createAdminSchema>['body'];

export const updateAdminSchema = z.object({
  params: z.object({ adminId: z.string().uuid() }),
  body: z.object({
    email: z.string().email().max(250).optional(),
    nom: z.string().min(1).max(100).optional(),
    prenom: z.string().min(1).max(100).optional(),
  }),
});

export type UpdateAdminSchema = z.infer<typeof updateAdminSchema>;

export const updateAdminPasswordSchema = z.object({
  params: z.object({ adminId: z.string().uuid() }),
  body: z.object({
    password: z
      .string({ required_error: 'Le mot de passe est obligatoire' })
      .min(8, { message: '8 caractères minimum' }),
  }),
});

export type UpdateAdminPasswordSchema = z.infer<typeof updateAdminPasswordSchema>;

export const adminIdParamSchema = z.object({
  params: z.object({ adminId: z.string().uuid() }),
});

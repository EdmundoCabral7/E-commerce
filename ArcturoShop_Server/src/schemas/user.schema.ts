import { z } from 'zod';


export const updateProfileSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres').optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Formato de telefone inválido').optional().nullable(),
  bio: z.string().max(255, 'A bio não pode exceder 255 caracteres').optional().nullable(),
});

export type UpdateProfileDTO = z.infer<typeof updateProfileSchema>;



export const createUserSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;

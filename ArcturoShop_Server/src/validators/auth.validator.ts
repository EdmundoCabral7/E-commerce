import { z } from 'zod';

// Schema de validação para o registro de usuário
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter ao menos 2 caracteres.')
    .optional(),
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório.')
    .email('Informe um e-mail válido.'),
  password: z
    .string()
    .min(6, 'A senha deve ter ao menos 6 caracteres.'),
});

// Schema de validação para o login
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'O e-mail é obrigatório.')
    .email('Informe um e-mail válido.'),
  password: z
    .string()
    .min(1, 'A senha é obrigatória.'),
});

// Tipos inferidos dos schemas
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

import { z } from 'zod';

export const withdrawSchema = z.object({
  fullName: z.string().min(5, 'Nome completo é necessário'),
  document: z.string().min(11, 'CPF ou CNPJ inválido'),
  pixKey: z.string().min(1, 'Chave PIX é necessária'),
  pixType: z.string().min(1, 'Tipo de chave é necessário'),
  amount: z
    .number({ message: 'Valor deve ser um número' })
    .positive('Valor deve ser maior que zero'),
});

export type WithdrawDTO = z.infer<typeof withdrawSchema>;

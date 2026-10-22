import { z } from 'zod';

/**
 * Schema de validação para adicionar um produto ao carrinho.
 * - productId: deve ser um UUID válido
 * - quantity: número inteiro positivo (mínimo 1)
 */
export const addToCartSchema = z.object({
  productId: z.string().uuid('O productId deve ser um UUID válido.'),
  quantity: z
    .number()
    .int('A quantidade deve ser um número inteiro.')
    .min(1, 'A quantidade mínima é 1.'),
});

export type AddToCartDTO = z.infer<typeof addToCartSchema>;

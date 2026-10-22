import { z } from 'zod';

export const createSaleSchema = z.object({
  buyerName: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  buyerEmail: z.string().email('Email inválido'),
  paymentMethod: z.string().min(2, 'Método de pagamento não informado'),
  items: z.array(z.object({
    productId: z.string().uuid('ID de produto inválido'),
    quantity: z.number().int().positive('A quantidade deve ser um número inteiro positivo'),
  })).min(1, 'O pedido deve ter pelo menos um item'),
  promotionId: z.string().uuid().optional(),
});

export type CreateSaleDTO = z.infer<typeof createSaleSchema>;

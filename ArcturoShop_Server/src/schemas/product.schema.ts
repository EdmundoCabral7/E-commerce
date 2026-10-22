import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(3, 'O nome deve ter ao menos 3 caracteres.'),
  description: z.string().optional(),
  price: z.preprocess((val: unknown) => Number(val), z.number().positive('O preço deve ser positivo.')),
  stock: z.preprocess((val: unknown) => Number(val), z.number().int().min(0, 'O estoque não pode ser negativo.')),
  categoryId: z.string().uuid('ID de categoria inválido.').optional(),
  organizationId: z.string().uuid('ID de organização inválido.'),
  isActive: z.preprocess((val: unknown) => val === 'true' || val === true, z.boolean()).optional().default(true),
});

export const updateProductSchema = createProductSchema.partial();
export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;

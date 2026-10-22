import { z } from 'zod';

export const createDeliveryRegionSchema = z.object({
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  regiao: z.string().min(2, 'Região é obrigatória'),
  tipo: z.string().min(2, 'Tipo de entrega é obrigatório'),
  preco: z
    .number({ message: 'Preço deve ser um número' })
    .positive('Preço deve ser maior que zero'),
});

export const updateDeliveryRegionSchema = createDeliveryRegionSchema.partial();

export type CreateDeliveryRegionDTO = z.infer<typeof createDeliveryRegionSchema>;
export type UpdateDeliveryRegionDTO = z.infer<typeof updateDeliveryRegionSchema>;

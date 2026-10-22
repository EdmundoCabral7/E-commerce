import { z } from 'zod';
import { PromotionType } from '@prisma/client';

const promotionBase = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  type: z.nativeEnum(PromotionType),
  value: z.number().positive('O valor deve ser positivo'),
  startDate: z.string().transform((val: string) => new Date(val)),
  endDate: z.string().transform((val: string) => new Date(val)),
  isActive: z.boolean().optional().default(true),
  minOrderValue: z.number().optional().default(0),
  categoryId: z.string().uuid().optional(),
  productIds: z.array(z.string().uuid()).optional(),
});

export const createPromotionSchema = promotionBase.refine((data: any) => data.endDate > data.startDate, {
  message: 'A data de término deve ser posterior à data de início',
  path: ['endDate'],
}).refine((data: any) => {
  if (data.type === PromotionType.PERCENTAGE && data.value > 100) {
    return false;
  }
  return true;
}, {
  message: 'O valor do desconto percentual não pode exceder 100%',
  path: ['value'],
});

// Para o update, como é partial, as validações de data só fazem sentido se ambas estiverem presentes
export const updatePromotionSchema = promotionBase.partial().refine((data: any) => {
  if (data.startDate && data.endDate) {
    return data.endDate > data.startDate;
  }
  return true;
}, {
  message: 'A data de término deve ser posterior à data de início',
  path: ['endDate'],
});

export type CreatePromotionDTO = z.infer<typeof createPromotionSchema>;
export type UpdatePromotionDTO = z.infer<typeof updatePromotionSchema>;

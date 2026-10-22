import { z } from 'zod';


export const createQuestionSchema = z.object({
  content: z.string().min(5, 'A pergunta deve ter pelo menos 5 caracteres').max(500, 'A pergunta é muito longa'),
});

export const createReviewSchema = z.object({
  rating: z.number().int().min(1, 'A nota mínima é 1').max(5, 'A nota máxima é 5'),
  comment: z.string().max(1000, 'O comentário é muito longo').optional(),
});

export type CreateQuestionDTO = z.infer<typeof createQuestionSchema>;
export type CreateReviewDTO = z.infer<typeof createReviewSchema>;

import { ProductQuestion, Prisma } from '@prisma/client';
import prisma from '../config/prisma';

export class QuestionRepository {
  async create(data: Prisma.ProductQuestionUncheckedCreateInput): Promise<ProductQuestion> {
    return prisma.productQuestion.create({
      data,
    });
  }

  async findByProductId(productId: string): Promise<ProductQuestion[]> {
    return prisma.productQuestion.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async answerQuestion(id: string, answer: string): Promise<ProductQuestion> {
    return prisma.productQuestion.update({
      where: { id },
      data: { answer },
    });
  }

  async deleteQuestion(id: string): Promise<ProductQuestion> {
    return prisma.productQuestion.delete({ where: { id } });
  }
}

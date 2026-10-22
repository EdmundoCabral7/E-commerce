import { ProductReview, Prisma } from '@prisma/client';
import prisma from '../config/prisma';

export class ReviewRepository {
  async create(data: Prisma.ProductReviewUncheckedCreateInput): Promise<ProductReview> {
    return prisma.productReview.create({
      data,
    });
  }

  async findByProductId(productId: string): Promise<ProductReview[]> {
    return prisma.productReview.findMany({
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

  async findByUserAndProduct(userId: string, productId: string): Promise<ProductReview | null> {
    return prisma.productReview.findFirst({
      where: { userId, productId },
    });
  }
}

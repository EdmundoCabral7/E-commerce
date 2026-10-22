import { Favorite, Prisma } from '@prisma/client';
import prisma from '../config/prisma';

export class FavoriteRepository {
  async add(userId: string, productId: string): Promise<Favorite> {
    return prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    });
  }

  async remove(userId: string, productId: string): Promise<Favorite> {
    return prisma.favorite.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async findByUserAndProduct(userId: string, productId: string): Promise<Favorite | null> {
    return prisma.favorite.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
  }

  async findAllByUser(userId: string) {
    return prisma.favorite.findMany({
      where: { userId },
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

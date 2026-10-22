import { Prisma, Promotion } from '@prisma/client';
import prisma from '../config/prisma';

export class PromotionRepository {
  /**
   * Busca todas as promoções de uma organização.
   */
  async findAll(organizationId: string) {
    return prisma.promotion.findMany({
      where: { organizationId },
      include: {
        category: { select: { name: true } },
        _count: { select: { products: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Busca promoções ativas e vigentes.
   */
  async findActive(organizationId: string) {
    const now = new Date();
    return prisma.promotion.findMany({
      where: {
        organizationId,
        isActive: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        products: true,
        category: {
          include: { products: true }
        }
      }
    });
  }

  async findById(id: string, organizationId: string): Promise<Promotion | null> {
    return prisma.promotion.findFirst({
      where: { id, organizationId },
      include: {
        products: true,
        category: true
      }
    });
  }

  async create(organizationId: string, data: any): Promise<Promotion> {
    const { productIds, ...rest } = data;
    
    return prisma.promotion.create({
      data: {
        ...rest,
        organizationId,
        products: productIds ? {
          connect: productIds.map((id: string) => ({ id }))
        } : undefined
      }
    });
  }

  async update(id: string, organizationId: string, data: any): Promise<Promotion> {
    const { productIds, ...rest } = data;

    return prisma.promotion.update({
      where: { id },
      data: {
        ...rest,
        products: productIds ? {
          set: productIds.map((id: string) => ({ id }))
        } : undefined
      }
    });
  }

  async delete(id: string): Promise<Promotion> {
    return prisma.promotion.delete({
      where: { id }
    });
  }
}

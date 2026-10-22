import { Prisma, Category } from '@prisma/client';
import prisma from '../config/prisma';

export class CategoryRepository {
  /**
   * Lista todas as categorias de uma organização.
   * Pode filtrar apenas por ativas e inclui contagem de produtos.
   */
  async findAll(organizationId: string, onlyActive: boolean = true): Promise<any[]> {
    return prisma.category.findMany({
      where: {
        organizationId,
        ...(onlyActive ? { isActive: true } : {}),
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string, organizationId: string): Promise<Category | null> {
    return prisma.category.findFirst({
      where: { id, organizationId },
    });
  }

  async findBySlug(slug: string, organizationId: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: {
        organizationId_slug: {
          organizationId,
          slug,
        },
      },
    });
  }

  async findByName(name: string, organizationId: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: {
        organizationId_name: {
          organizationId,
          name,
        },
      },
    });
  }

  async create(data: Prisma.CategoryUncheckedCreateInput): Promise<Category> {
    return prisma.category.create({ data });
  }

  async update(id: string, organizationId: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return prisma.category.update({
      where: { id }, // No Prisma update, ID deve ser único globalmente (uuid), mas validamos orgId no service
      data,
    });
  }

  async delete(id: string): Promise<Category> {
    return prisma.category.delete({
      where: { id },
    });
  }

  /**
   * Conta quantos produtos estão vinculados a esta categoria.
   */
  async countProducts(id: string): Promise<number> {
    return prisma.product.count({
      where: { categoryId: id },
    });
  }
}

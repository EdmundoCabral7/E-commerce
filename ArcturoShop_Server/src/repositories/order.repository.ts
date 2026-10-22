import { Prisma, Order } from '@prisma/client';
import prisma from '../config/prisma';

interface CreateOrderData {
  buyerName: string;
  buyerEmail: string;
  paymentMethod: string;
  total: number;
  discount?: number;
  userId?: string;
  promotionId?: string;
}

interface OrderItemData {
  productId: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export class OrderRepository {
  /**
   * Cria um pedido em uma transação atômica:
   * 1. Cria o registro do Pedido (Order)
   * 2. Cria os itens do pedido (OrderItems)
   * 3. Reduz o estoque de cada produto
   */
  async createWithTransaction(organizationId: string, data: CreateOrderData, items: OrderItemData[]): Promise<Order> {
    const { buyerName, buyerEmail, paymentMethod, total, discount, userId, promotionId } = data;

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Cria o Pedido
      const order = await tx.order.create({
        data: {
          organizationId,
          userId,
          buyerName,
          buyerEmail,
          paymentMethod,
          total,
          discount,
          promotionId,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              subtotal: item.subtotal,
            })),
          },
        },
        include: { items: true },
      });

      // 2. Atualiza o estoque de cada produto
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      return order;
    });
  }

  /**
   * Lista vendas de uma organização com filtros.
   */
  async findAllByOrg(organizationId: string, filters: any): Promise<any> {
    const { status, startDate, endDate, page = 1, limit = 10 } = filters;

    const where: Prisma.OrderWhereInput = {
      organizationId,
      ...(status ? { status } : {}),
      ...(startDate || endDate ? {
        createdAt: {
          ...(startDate ? { gte: new Date(startDate) } : {}),
          ...(endDate ? { lte: new Date(endDate) } : {}),
        },
      } : {}),
    };

    const [totalCount, items] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: { items: { include: { product: { select: { name: true } } } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return { totalCount, items };
  }

  async updateStatus(id: string, organizationId: string, status: string): Promise<any> {
    return prisma.order.update({
      where: { id },
      data: { status: status as any },
    });
  }

  async findById(id: string, organizationId: string): Promise<any> {
    return prisma.order.findFirst({
      where: { id, organizationId },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, imageUrl: true }
            }
          }
        }
      }
    });
  }

  /**
   * Resumo de vendas para relatórios.
   */
  async getSummary(organizationId: string): Promise<any> {
    const now = new Date();
    const firstDayMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [monthlyRevenue, totalSales, topProduct] = await Promise.all([
      // Receita do mês atual
      prisma.order.aggregate({
        where: { organizationId, createdAt: { gte: firstDayMonth }, status: 'PAID' },
        _sum: { total: true }
      }),
      // Total de vendas históricas
      prisma.order.count({
        where: { organizationId, status: 'PAID' }
      }),
      // Produto mais vendido
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: { order: { organizationId, status: 'PAID' } },
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 1
      })
    ]);

    return {
      monthlyRevenue: monthlyRevenue._sum.total || 0,
      totalPaidSales: totalSales,
      topProductId: topProduct[0]?.productId || null,
      topProductQuantity: topProduct[0]?._sum.quantity || 0
    };
  }

  async findByUserId(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, imageUrl: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}

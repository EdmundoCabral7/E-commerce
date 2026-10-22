import { WithdrawalStatus } from '@prisma/client';
import prisma from '../config/prisma';
import { WithdrawDTO } from '../schemas/wallet.schema';

const GATEWAY_FEE_RATE = 0.038;

export class WalletRepository {
  async getStats(orgId: string) {
    const now = new Date();
    const firstDayMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [totalRevenue, monthlyRevenue, gatewayFees, pendingWithdrawals] =
      await Promise.all([
        prisma.order.aggregate({
          where: { organizationId: orgId, status: 'PAID' },
          _sum: { total: true },
        }),
        prisma.order.aggregate({
          where: {
            organizationId: orgId,
            status: 'PAID',
            createdAt: { gte: firstDayMonth },
          },
          _sum: { total: true },
        }),
        prisma.order.aggregate({
          where: { organizationId: orgId, status: 'PAID' },
          _sum: { total: true },
        }),
        prisma.walletWithdrawal.aggregate({
          where: { organizationId: orgId, status: 'PENDING' },
          _sum: { amount: true },
        }),
      ]);

    const totalBalance = Number(totalRevenue._sum.total ?? 0);
    const totalGatewayFees = totalBalance * GATEWAY_FEE_RATE;
    const pendingPayout = Number(pendingWithdrawals._sum.amount ?? 0);
    const netProfit = totalBalance - totalGatewayFees - pendingPayout;

    return {
      totalBalance,
      pendingPayout,
      gatewayFees: totalGatewayFees,
      netProfit,
      monthlyRevenue: Number(monthlyRevenue._sum.total ?? 0),
    };
  }

  async getTransactions(orgId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [totalCount, items] = await Promise.all([
      prisma.order.count({ where: { organizationId: orgId } }),
      prisma.order.findMany({
        where: { organizationId: orgId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          createdAt: true,
          paymentMethod: true,
          status: true,
          total: true,
          discount: true,
          buyerName: true,
          items: {
            take: 1,
            select: { product: { select: { name: true } } },
          },
        },
      }),
    ]);

    return { totalCount, items };
  }

  async createWithdrawal(orgId: string, data: WithdrawDTO) {
    return prisma.walletWithdrawal.create({
      data: {
        organizationId: orgId,
        fullName: data.fullName,
        document: data.document,
        pixKey: data.pixKey,
        pixType: data.pixType,
        amount: data.amount,
        status: WithdrawalStatus.PENDING,
      },
    });
  }

  async getWithdrawals(orgId: string) {
    return prisma.walletWithdrawal.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAnalysis(orgId: string) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Orders paid today
    const [todayOrders, totalOrders, avgTicketResult, scheduleRaw] = await Promise.all([
      prisma.order.count({ where: { organizationId: orgId, status: 'PAID', createdAt: { gte: todayStart } } }),
      prisma.order.count({ where: { organizationId: orgId, createdAt: { gte: todayStart } } }),
      prisma.order.aggregate({
        where: { organizationId: orgId, status: 'PAID' },
        _avg: { total: true },
      }),
      // Next 3 days revenue grouped by date
      prisma.$queryRaw<{ day: Date; total: number }[]>`
        SELECT DATE("createdAt") as day, SUM(total)::float as total
        FROM orders
        WHERE "organizationId" = ${orgId}
          AND status = 'PAID'
          AND "createdAt" >= NOW() - INTERVAL '7 days'
        GROUP BY DATE("createdAt")
        ORDER BY day DESC
        LIMIT 3
      `,
    ]);

    const conversionRate = totalOrders > 0 ? (todayOrders / totalOrders) * 100 : 0;
    const avgTicket = Number(avgTicketResult._avg.total ?? 0);

    const schedule = scheduleRaw.map((row) => ({
      date: row.day,
      amount: Number(row.total),
    }));

    return { conversionRate, avgTicket, schedule };
  }
}

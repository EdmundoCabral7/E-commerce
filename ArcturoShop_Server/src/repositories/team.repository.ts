import { OrgRole } from '@prisma/client';
import prisma from '../config/prisma';

export class TeamRepository {
  async findMembers(orgId: string) {
    return prisma.organizationMember.findMany({
      where: { organizationId: orgId },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findMemberById(id: string, orgId: string) {
    return prisma.organizationMember.findFirst({
      where: { id, organizationId: orgId },
    });
  }

  async findMemberByUserId(orgId: string, userId: string) {
    return prisma.organizationMember.findFirst({
      where: { organizationId: orgId, userId },
    });
  }

  async addMember(orgId: string, userId: string, role: OrgRole) {
    return prisma.organizationMember.create({
      data: { organizationId: orgId, userId, role },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
  }

  async updateRole(id: string, role: OrgRole) {
    return prisma.organizationMember.update({
      where: { id },
      data: { role },
    });
  }

  async removeMember(id: string) {
    return prisma.organizationMember.delete({ where: { id } });
  }

  async createInvite(orgId: string, email: string, role: OrgRole) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return prisma.orgInvite.create({
      data: { organizationId: orgId, email, role, expiresAt },
    });
  }

  async getOrgStats(orgId: string) {
    const [memberCount, revenueAgg, orderCount] = await Promise.all([
      prisma.organizationMember.count({ where: { organizationId: orgId } }),
      prisma.order.aggregate({
        where: { organizationId: orgId, status: 'PAID' },
        _sum: { total: true },
      }),
      prisma.order.count({ where: { organizationId: orgId, status: 'PAID' } }),
    ]);

    return {
      memberCount,
      totalRevenue: Number(revenueAgg._sum.total ?? 0),
      totalOrders: orderCount,
    };
  }
}

import prisma from '../config/prisma';

export class OrgRepository {
  async getProfile(orgId: string) {
    const [org, totalOrders, totalMembers] = await Promise.all([
      prisma.organization.findUnique({
        where: { id: orgId },
        select: { id: true, name: true, createdAt: true },
      }),
      prisma.order.count({ where: { organizationId: orgId } }),
      prisma.organizationMember.count({ where: { organizationId: orgId } }),
    ]);
    return org ? { ...org, totalOrders, totalMembers } : null;
  }
}

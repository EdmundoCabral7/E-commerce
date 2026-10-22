import prisma from '../config/prisma';
import { CreateDeliveryRegionDTO, UpdateDeliveryRegionDTO } from '../schemas/delivery.schema';

export class DeliveryRepository {
  async findAll(orgId: string) {
    return prisma.deliveryRegion.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, orgId: string) {
    return prisma.deliveryRegion.findFirst({
      where: { id, organizationId: orgId },
    });
  }

  async create(orgId: string, data: CreateDeliveryRegionDTO) {
    return prisma.deliveryRegion.create({
      data: {
        organizationId: orgId,
        cidade: data.cidade,
        regiao: data.regiao,
        tipo: data.tipo,
        preco: data.preco,
      },
    });
  }

  async update(id: string, data: UpdateDeliveryRegionDTO) {
    return prisma.deliveryRegion.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return prisma.deliveryRegion.delete({ where: { id } });
  }
}

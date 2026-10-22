import { AppError } from '../middlewares/errorHandler';
import { DeliveryRepository } from '../repositories/delivery.repository';
import { CreateDeliveryRegionDTO, UpdateDeliveryRegionDTO } from '../schemas/delivery.schema';

const deliveryRepository = new DeliveryRepository();

export class DeliveryService {
  async findAll(orgId: string) {
    return deliveryRepository.findAll(orgId);
  }

  async create(orgId: string, data: CreateDeliveryRegionDTO) {
    return deliveryRepository.create(orgId, data);
  }

  async update(id: string, orgId: string, data: UpdateDeliveryRegionDTO) {
    const existing = await deliveryRepository.findById(id, orgId);
    if (!existing) throw new AppError('Região de entrega não encontrada.', 404);
    return deliveryRepository.update(id, data);
  }

  async delete(id: string, orgId: string) {
    const existing = await deliveryRepository.findById(id, orgId);
    if (!existing) throw new AppError('Região de entrega não encontrada.', 404);
    return deliveryRepository.delete(id);
  }
}

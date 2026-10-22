import { PromotionRepository } from '../repositories/promotion.repository';
import { CreatePromotionDTO, UpdatePromotionDTO } from '../schemas/promotion.schema';
import { AppError } from '../middlewares/errorHandler';
import { PromotionType } from '@prisma/client';

const promotionRepository = new PromotionRepository();

export class PromotionService {
  /**
   * Lista todas as promoções de uma organização (Visão Admin).
   */
  async getAll(organizationId: string) {
    return promotionRepository.findAll(organizationId);
  }

  /**
   * Lista produtos com preços promocionais calculados.
   */
  async getActivePromotions(organizationId: string) {
    const activePromotions = await promotionRepository.findActive(organizationId);
    
    // Mapa para consolidar produtos e seus melhores preços
    const discountedProducts = new Map<string, any>();

    for (const promo of activePromotions) {
      // Coleta todos os produtos afetados por esta promoção
      const products = [...(promo.products || [])];
      
      // Se a promoção for por categoria, adiciona os produtos da categoria
      if (promo.category?.products) {
        products.push(...promo.category.products);
      }

      for (const product of products) {
        const discountedPrice = this.calculateDiscount(Number(product.price), promo);
        
        // Se o produto já foi processado por outra promoção, mantém o menor preço
        const existing = discountedProducts.get(product.id);
        if (!existing || discountedPrice < existing.discountedPrice) {
          discountedProducts.set(product.id, {
            ...product,
            originalPrice: product.price,
            discountedPrice: discountedPrice,
            promotionName: promo.name
          });
        }
      }
    }

    return Array.from(discountedProducts.values());
  }

  async create(organizationId: string, data: CreatePromotionDTO) {
    return promotionRepository.create(organizationId, data);
  }

  async update(id: string, organizationId: string, data: UpdatePromotionDTO) {
    const promo = await promotionRepository.findById(id, organizationId);
    if (!promo) throw new AppError('Promoção não encontrada.', 404);

    return promotionRepository.update(id, organizationId, data);
  }

  async delete(id: string, organizationId: string) {
    const promo = await promotionRepository.findById(id, organizationId);
    if (!promo) throw new AppError('Promoção não encontrada.', 404);

    return promotionRepository.delete(id);
  }

  /**
   * Lógica de cálculo de desconto.
   */
  private calculateDiscount(originalPrice: number, promo: any): number {
    const value = Number(promo.value);
    if (promo.type === PromotionType.PERCENTAGE) {
      return originalPrice * (1 - value / 100);
    }
    // FIXED: Garante que o preço não fique negativo
    return Math.max(0, originalPrice - value);
  }
}

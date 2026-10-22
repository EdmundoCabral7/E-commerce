import { OrderRepository } from '../repositories/order.repository';
import { ProductRepository } from '../repositories/product.repository';
import { PromotionService } from './promotion.service';
import { CreateSaleDTO } from '../schemas/sale.schema';
import { AppError } from '../middlewares/errorHandler';

const orderRepository = new OrderRepository();
const productRepository = new ProductRepository();
const promotionService = new PromotionService();

export class OrderService {
  /**
   * Realiza o checkout de um pedido.
   */
  async checkout(organizationId: string, data: CreateSaleDTO, userId?: string) {
    const processedItems = [];
    let totalDiscount = 0;
    let totalOrder = 0;

    // 1. Validar e processar cada item
    for (const item of data.items) {
      const product = await productRepository.findById(item.productId, organizationId);
      
      if (!product) {
        throw new AppError(`Produto ${item.productId} não encontrado nesta loja.`, 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(`Estoque insuficiente para o produto ${product.name}. Disponível: ${product.stock}`, 400);
      }

      // 2. Verificar promoções ativas para o produto
      // Reutiliza a lógica do PromotionService para calcular o melhor preço
      const activePromos = await promotionService.getActivePromotions(organizationId);
      const promoInfo = activePromos.find(p => p.id === product.id);
      
      const unitPrice = promoInfo ? Number(promoInfo.discountedPrice) : Number(product.price);
      const subtotal = unitPrice * item.quantity;
      const originalSubtotal = Number(product.price) * item.quantity;

      totalDiscount += (originalSubtotal - subtotal);
      totalOrder += subtotal;

      processedItems.push({
        productId: product.id,
        quantity: item.quantity,
        price: unitPrice,
        subtotal: subtotal
      });
    }

    // 3. Criar pedido via transação
    return orderRepository.createWithTransaction(
      organizationId,
      {
        ...data,
        userId,
        total: totalOrder,
        discount: totalDiscount,
      },
      processedItems
    );
  }

  async listSales(organizationId: string, filters: any) {
    return orderRepository.findAllByOrg(organizationId, filters);
  }

  async getDetail(id: string, organizationId: string) {
    const order = await orderRepository.findById(id, organizationId);
    if (!order) throw new AppError('Pedido não encontrado.', 404);
    return order;
  }

  async updateStatus(id: string, organizationId: string, status: string) {
    const valid = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELED"];
    if (!valid.includes(status)) throw new AppError('Status inválido.', 400);
    const order = await orderRepository.findById(id, organizationId);
    if (!order) throw new AppError('Pedido não encontrado.', 404);
    return orderRepository.updateStatus(id, organizationId, status);
  }

  async getSummary(organizationId: string) {
    return orderRepository.getSummary(organizationId);
  }

  async getHistory(userId: string) {
    return orderRepository.findByUserId(userId);
  }
}

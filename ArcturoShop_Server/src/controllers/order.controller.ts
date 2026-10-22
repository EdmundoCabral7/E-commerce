import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';

const orderService = new OrderService();

/**
 * Controller de Pedidos.
 * Expõe o endpoint de histórico de pedidos.
 */
export class OrderController {
  /**
   * GET /api/orders/history
   * Retorna os pedidos do usuário autenticado no padrão de resposta definido.
   */
  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      // O ID do usuário vem do middleware de autenticação
      const userId = req.user!.id;
      
      const orders = await orderService.getHistory(userId);
      
      // Resposta padronizada
      res.status(200).json({
        success: true,
        data: orders,
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
}

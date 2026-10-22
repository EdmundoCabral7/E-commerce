import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service';
import { createSaleSchema } from '../schemas/sale.schema';

const orderService = new OrderService();

export class SaleController {
  /**
   * POST /api/org/:orgId/sales
   * Checkout público (pode ser anônimo ou logado)
   */
  async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = String(req.params.orgId);
      const parsed = createSaleSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
        return;
      }

      // Se o usuário estiver logado, vinculamos o ID dele ao pedido
      const userId = req.user?.id;
      const order = await orderService.checkout(orgId, parsed.data, userId);
      
      res.status(201).json({ data: order });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/org/:orgId/sales
   * Lista vendas da organização (Admin)
   */
  async listSales(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = String(req.params.orgId);
      const { status, startDate, endDate, page, limit } = req.query;

      const filters = {
        status: status as string,
        startDate: startDate as string,
        endDate: endDate as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10
      };

      const result = await orderService.listSales(orgId, filters);
      res.status(200).json({ data: result.items, meta: { total: result.totalCount } });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/org/:orgId/sales/:id
   * Detalhes da venda
   */
  async getDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = String(req.params.orgId);
      const id = String(req.params.id);
      const order = await orderService.getDetail(id, orgId);
      res.status(200).json({ data: order });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/org/:orgId/sales/report/summary
   * Resumo de vendas (Admin)
   */
  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = String(req.params.orgId);
      const summary = await orderService.getSummary(orgId);
      res.status(200).json({ data: summary });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = String(req.params.orgId);
      const id = String(req.params.id);
      const { status } = req.body;
      const order = await orderService.updateStatus(id, orgId, status);
      res.status(200).json({ data: order });
    } catch (error) {
      next(error);
    }
  }
}

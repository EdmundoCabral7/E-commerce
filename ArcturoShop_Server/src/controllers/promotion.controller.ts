import { Request, Response, NextFunction } from 'express';
import { PromotionService } from '../services/promotion.service';
import { createPromotionSchema, updatePromotionSchema } from '../schemas/promotion.schema';

const promotionService = new PromotionService();

export class PromotionController {
  /**
   * GET /api/org/:orgId/promotions
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = String(req.params.orgId);
      const promotions = await promotionService.getAll(orgId);
      res.status(200).json({ data: promotions });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/org/:orgId/promotions/active
   */
  async getActive(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = String(req.params.orgId);
      const products = await promotionService.getActivePromotions(orgId);
      res.status(200).json({ data: products });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/org/:orgId/promotions
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = String(req.params.orgId);
      const parsed = createPromotionSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
        return;
      }

      const promotion = await promotionService.create(orgId, parsed.data);
      res.status(201).json({ data: promotion });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/org/:orgId/promotions/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = String(req.params.orgId);
      const id = String(req.params.id);
      const parsed = updatePromotionSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
        return;
      }

      const promotion = await promotionService.update(id, orgId, parsed.data);
      res.status(200).json({ data: promotion });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/org/:orgId/promotions/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = String(req.params.orgId);
      const id = String(req.params.id);
      await promotionService.delete(id, orgId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

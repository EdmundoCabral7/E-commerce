import { Request, Response, NextFunction } from 'express';
import { DeliveryService } from '../services/delivery.service';
import { createDeliveryRegionSchema, updateDeliveryRegionSchema } from '../schemas/delivery.schema';

const deliveryService = new DeliveryService();

export class DeliveryController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await deliveryService.findAll(req.params.orgId as string);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = createDeliveryRegionSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
        return;
      }
      const data = await deliveryService.create(req.params.orgId as string, parsed.data);
      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateDeliveryRegionSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
        return;
      }
      const data = await deliveryService.update(req.params.id as string, req.params.orgId as string, parsed.data);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await deliveryService.delete(req.params.id as string, req.params.orgId as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

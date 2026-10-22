import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';

const categoryService = new CategoryService();

export class CategoryController {
  /**
   * GET /api/org/:orgId/categories
   */
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = String(req.params.orgId);
      const categories = await categoryService.getAll(orgId);
      res.status(200).json({ data: categories });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/org/:orgId/categories
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = String(req.params.orgId);
      const parsed = createCategorySchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
        return;
      }

      const file = req.file; // Capturado pelo multer
      const category = await categoryService.create(orgId, parsed.data, file);

      res.status(201).json({ data: category });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/org/:orgId/categories/:id
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = String(req.params.orgId);
      const id = String(req.params.id);
      const parsed = updateCategorySchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
        return;
      }

      const file = req.file;
      const category = await categoryService.update(id, orgId, parsed.data, file);

      res.status(200).json({ data: category });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/org/:orgId/categories/:id
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = String(req.params.orgId);
      const id = String(req.params.id);
      await categoryService.delete(id, orgId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

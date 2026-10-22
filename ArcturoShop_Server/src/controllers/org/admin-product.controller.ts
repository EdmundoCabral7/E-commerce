import { Request, Response, NextFunction } from 'express';
import { AdminProductService } from '../../services/org/admin-product.service';
import { createProductSchema, updateProductSchema } from '../../schemas/product.schema';

const adminProductService = new AdminProductService();

/**
 * Controller Administrativo de Produtos.
 * Gerencia o estoque e catálogo de uma organização específica.
 */
export class AdminProductController {
    /**
     * GET /api/org/:orgId/products
     * Lista todos os produtos da organização.
     */
    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const orgId = req.orgId!;
            const products = await adminProductService.getAllFromOrg(orgId);
            res.status(200).json({
                success: true,
                data: products,
                error: null
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/org/:orgId/products
     * Cria um novo produto na organização.
     */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const orgId = req.orgId!;
            const parsed = createProductSchema.safeParse(req.body);

            if (!parsed.success) {
                res.status(400).json({
                    success: false,
                    data: null,
                    error: {
                        message: 'Erro de validação',
                        details: parsed.error.flatten().fieldErrors
                    }
                });
                return;
            }

            const files = (req.files as Express.Multer.File[]) ?? [];
            const imageUrls = files.map((f) => f.path);
            const imageUrl = imageUrls[0] ?? undefined;
            const images = imageUrls.length > 0 ? imageUrls : undefined;

            const product = await adminProductService.create(orgId, { ...parsed.data, imageUrl, images });
            res.status(201).json({
                success: true,
                data: product,
                error: null
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /api/org/:orgId/products/:id
     * Atualiza dados de um produto existente.
     */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const orgId = req.orgId!;
            const id = String(req.params.id);
            const parsed = updateProductSchema.safeParse(req.body);

            if (!parsed.success) {
                res.status(400).json({
                    success: false,
                    data: null,
                    error: {
                        message: 'Erro de validação',
                        details: parsed.error.flatten().fieldErrors
                    }
                });
                return;
            }

            const files = (req.files as Express.Multer.File[]) ?? [];
            const imageUrls = files.map((f) => f.path);
            const imageUrl = imageUrls[0] ?? undefined;
            const images = imageUrls.length > 0 ? imageUrls : undefined;

            const product = await adminProductService.update(id, orgId, {
                ...parsed.data,
                ...(imageUrl ? { imageUrl } : {}),
                ...(images ? { images } : {}),
            });
            res.status(200).json({
                success: true,
                data: product,
                error: null
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/org/:orgId/products/:id
     * Remove um produto da organização.
     */
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const orgId = req.orgId!;
            const id = String(req.params.id);

            await adminProductService.delete(id, orgId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

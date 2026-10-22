import { Request, Response, NextFunction } from "express";
import { ProductService } from "../services/product.service";
import { createProductSchema } from "../schemas/product.schema";

const productService = new ProductService();

/**
 * Controller de Produtos.
 * Gerencia operações de vitrine e administrativas.
 */
export class ProductController {
    /**
     * GET /api/products
     * Retorna produtos ativos para a vitrine com filtros e paginação.
     */
    async findAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { category, search, minPrice, maxPrice, page, limit, organizationId } = req.query;

            const filters = {
                category: category as string,
                search: search as string,
                minPrice: minPrice ? Number(minPrice) : undefined,
                maxPrice: maxPrice ? Number(maxPrice) : undefined,
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 100,
                organizationId: organizationId as string | undefined,
            };

            const result = await productService.findAllPublic(filters);

            res.status(200).json({
                success: true,
                data: result.items,
                meta: result.meta,
                error: null
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/admin/products
     * Versão administrativa: lista todos os produtos (ativos/inativos) com métricas.
     */
    async findAdminAll(req: Request, res: Response, next: NextFunction) {
        try {
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 10;

            const result = await productService.findAllAdmin(page, limit);

            res.status(200).json({
                success: true,
                data: result.items,
                meta: result.meta,
                error: null
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/products/:id
     * Retorna detalhes de um produto específico (Público).
     */
    async findById(req: Request, res: Response, next: NextFunction) {
        try {
            const id = String(req.params.id);
            const product = await productService.getById(id);
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
     * POST /api/products
     * Cria um novo produto com upload de imagens.
     */
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            // Validação dos dados de texto (chegam via multipart/form-data)
            const parsed = createProductSchema.safeParse(req.body);

            if (!parsed.success) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Erro de validação',
                        details: parsed.error.flatten().fieldErrors
                    }
                });
                return;
            }

            // Captura as URLs das imagens retornadas pelo Cloudinary via Multer
            const files = req.files as Express.Multer.File[];
            const imageUrls = files?.map(file => file.path) || [];

            // Salva o produto no banco de dados
            const product = await productService.create(parsed.data, files);

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
     * PUT /api/products/:id
     * Atualiza dados de um produto e opcionalmente suas imagens.
     */
    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = String(req.params.id);
            const parsed = createProductSchema.partial().safeParse(req.body);

            if (!parsed.success) {
                res.status(400).json({
                    success: false,
                    error: {
                        message: 'Erro de validação',
                        details: parsed.error.flatten().fieldErrors
                    }
                });
                return;
            }

            const files = req.files as Express.Multer.File[];
            const product = await productService.update(id, parsed.data, files);

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
     * DELETE /api/products/:id
     * Remove o produto e limpa arquivos no Cloudinary.
     */
    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const id = String(req.params.id);
            await productService.delete(id);

            res.status(200).json({
                success: true,
                message: 'Produto removido com sucesso.',
                error: null
            });
        } catch (error) {
            next(error);
        }
    }

    /**
     * PATCH /api/products/:id/toggle
     * Alterna o status (ativo/inativo) do produto.
     */
    async toggleStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const id = String(req.params.id);
            const product = await productService.toggleStatus(id);

            res.status(200).json({
                success: true,
                data: product,
                error: null
            });
        } catch (error) {
            next(error);
        }
    }
}

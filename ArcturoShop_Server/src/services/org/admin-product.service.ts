import { ProductRepository } from "../../repositories/product.repository";
import { AppError } from "../../middlewares/errorHandler";
import { Prisma } from "@prisma/client";

const productRepository = new ProductRepository();

/**
 * Serviço de Produtos para o Painel Administrativo (Lojista).
 * Focado no CRUD completo com isolamento por organização (Multitenancy).
 */
export class AdminProductService {
    /**
     * Lista todos os produtos pertencentes a uma organização específica.
     */
    async getAllFromOrg(orgId: string) {
        return productRepository.findAll({
            where: { organizationId: orgId }
        });
    }

    /**
     * Busca um produto da organização pelo ID.
     */
    async getById(id: string, orgId: string) {
        const product = await productRepository.findById(id, orgId);
        if (!product) {
            throw new AppError('Produto não encontrado nesta organização.', 404);
        }
        return product;
    }

    /**
     * Cria um novo produto já vinculado ao orgId fornecido.
     */
    async create(orgId: string, data: Omit<Prisma.ProductUncheckedCreateInput, 'organizationId'>) {
        return productRepository.create({
            ...data,
            organizationId: orgId
        });
    }

    /**
     * Atualiza os dados de um produto da organização.
     */
    async update(id: string, orgId: string, data: Prisma.ProductUpdateInput) {
        try {
            return await productRepository.update(id, data, orgId);
        } catch (error: any) {
            // Repassa o erro de "não encontrado ou acesso negado" como AppError
            throw new AppError(error.message, 403);
        }
    }

    /**
     * Remove um produto da organização.
     */
    async delete(id: string, orgId: string) {
        try {
            return await productRepository.delete(id, orgId);
        } catch (error: any) {
            throw new AppError(error.message, 403);
        }
    }
}

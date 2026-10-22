import { ProductRepository } from "../../repositories/product.repository";
import { AppError } from "../../middlewares/errorHandler";

const productRepository = new ProductRepository();

/**
 * Serviço de Produtos para a vitrine pública.
 * Focado exclusivamente em operações de leitura.
 */
export class PublicProductService {
    /**
     * Retorna todos os produtos disponíveis (vitrine geral).
     * Futuramente poderá ser filtrado por slug de organização.
     */
    async getAll() {
        return productRepository.findAll({});
    }

    /**
     * Retorna os detalhes de um produto específico para visualização pública.
     */
    async getById(id: string) {
        const product = await productRepository.findById(id);
        if (!product) {
            throw new AppError('Produto não encontrado.', 404);
        }
        return product;
    }
}

import { AppError } from '../middlewares/errorHandler';
import { CartRepository } from '../repositories/cart.repository';
import { ProductRepository } from '../repositories/product.repository';
import { AddToCartDTO } from '../schemas/cart.schema';

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();

export class CartService {
  /**
   * Adiciona um produto ao carrinho do usuário autenticado.
   *
   * Fluxo:
   * 1. Valida que o produto existe no banco
   * 2. Valida que há estoque suficiente para a quantidade solicitada
   * 3. Busca ou cria o carrinho do usuário
   * 4. Faz upsert do item (adiciona ou soma a quantidade)
   * 5. Retorna o carrinho atualizado com todos os itens
   */
  async addToCart(userId: string, dto: AddToCartDTO) {
    const { productId, quantity } = dto;

    // 1. Verifica se o produto existe
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError('Produto não encontrado.', 404);
    }

    // 2. Garante que o usuário tem um carrinho (cria se não existir)
    const cart = await cartRepository.findOrCreateCart(userId);

    // 3. Verifica estoque considerando o que já está no carrinho
    const currentQty = await cartRepository.getCartItemQuantity(cart.id, productId);
    if (currentQty + quantity > product.stock) {
      throw new AppError(
        `Estoque insuficiente. Disponível: ${product.stock - currentQty} unidade(s).`,
        400,
      );
    }

    // 4. Adiciona o produto ou incrementa a quantidade se já estiver no carrinho
    await cartRepository.upsertCartItem(cart.id, productId, quantity);

    // 5. Retorna o carrinho atualizado com todos os itens e dados dos produtos
    return cartRepository.findCartByUserId(userId);
  }

  /**
   * Retorna o carrinho completo do usuário autenticado.
   * Cria um carrinho vazio caso ainda não exista.
   */
  async removeFromCart(userId: string, productId: string) {
    const cart = await cartRepository.findOrCreateCart(userId);
    await cartRepository.removeCartItem(cart.id, productId);
    return cartRepository.findCartByUserId(userId);
  }

  async updateQuantity(userId: string, productId: string, quantity: number) {
    const cart = await cartRepository.findOrCreateCart(userId);
    await cartRepository.setCartItemQuantity(cart.id, productId, quantity);
    return cartRepository.findCartByUserId(userId);
  }

  async getCart(userId: string) {
    // Garante que o carrinho existe antes de retorná-lo
    await cartRepository.findOrCreateCart(userId);
    return cartRepository.findCartByUserId(userId);
  }
}

import prisma from '../config/prisma';

export class CartRepository {
  /**
   * Busca o carrinho do usuário ou cria um novo caso não exista.
   * Garante que todo usuário autenticado tenha exatamente um carrinho.
   */
  async findOrCreateCart(userId: string) {
    return prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  /**
   * Retorna o carrinho completo com todos os itens e os dados
   * de cada produto relacionado.
   */
  async findCartByUserId(userId: string) {
    return prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  }

  /**
   * Adiciona um produto ao carrinho ou incrementa a quantidade
   * caso o produto já exista nele.
   *
   * O @@unique([cartId, productId]) no schema é o que permite
   * o upsert funcionar sem duplicar linhas.
   */
  async getCartItemQuantity(cartId: string, productId: string): Promise<number> {
    const item = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
      select: { quantity: true },
    });
    return item?.quantity ?? 0;
  }

  async upsertCartItem(cartId: string, productId: string, quantity: number) {
    return prisma.cartItem.upsert({
      where: {
        cartId_productId: { cartId, productId },
      },
      update: {
        quantity: { increment: quantity },
      },
      create: {
        cartId,
        productId,
        quantity,
      },
    });
  }

  async setCartItemQuantity(cartId: string, productId: string, quantity: number) {
    return prisma.cartItem.upsert({
      where: { cartId_productId: { cartId, productId } },
      update: { quantity },
      create: { cartId, productId, quantity },
    });
  }

  async removeCartItem(cartId: string, productId: string) {
    return prisma.cartItem.deleteMany({
      where: { cartId, productId },
    });
  }
}

import { Request, Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service';
import { addToCartSchema } from '../schemas/cart.schema';

const cartService = new CartService();

/**
 * Controller de Carrinho.
 * Gerencia as requisições HTTP relacionadas ao carrinho do usuário.
 * Todas as rotas aqui exigem que o middleware `authenticate` já tenha
 * injetado `req.user` com os dados do usuário autenticado.
 */
export class CartController {

  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {

      const parsed = addToCartSchema.safeParse(req.body);
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


      const userId = req.user!.id;

      const cart = await cartService.addToCart(userId, parsed.data);

      res.status(200).json({
        success: true,
        data: cart,
        error: null
      });
    } catch (error) {
      next(error);
    }
  }


  async removeFromCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const productId = req.params.productId as string;
      const cart = await cartService.removeFromCart(userId, productId);
      res.status(200).json({ success: true, data: cart, error: null });
    } catch (error) {
      next(error);
    }
  }

  async updateQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const parsed = addToCartSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ success: false, data: null, error: { message: 'Erro de validação' } });
        return;
      }
      const cart = await cartService.updateQuantity(userId, parsed.data.productId, parsed.data.quantity);
      res.status(200).json({ success: true, data: cart, error: null });
    } catch (error) {
      next(error);
    }
  }

  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const cart = await cartService.getCart(userId);
      res.status(200).json({
        success: true,
        data: cart,
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
}

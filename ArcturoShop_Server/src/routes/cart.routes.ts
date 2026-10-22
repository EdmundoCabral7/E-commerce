import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const cartController = new CartController();

// Todas as rotas do carrinho exigem usuário autenticado
router.use(authenticate);

router.post('/add', cartController.addToCart);
router.patch('/update', cartController.updateQuantity);
router.delete('/remove/:productId', cartController.removeFromCart);
router.get('/', cartController.getCart);

export default router;

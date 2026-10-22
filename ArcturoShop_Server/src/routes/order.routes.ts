import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const orderController = new OrderController();

/**
 * Rotas de Pedidos - Versão 1
 * Todas as rotas de histórico exigem autenticação.
 */
router.use(authenticate);

// GET /api/orders/history
router.get('/history', orderController.getHistory);

export default router;

import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const productController = new ProductController();

/**
 * Rotas Administrativas Globais (/api/admin/...)
 * Protegidas por authMiddleware (apenas cargo ADMIN).
 */
router.use(authMiddleware);

// --- Produtos ---
router.get('/products', productController.findAdminAll);

export default router;

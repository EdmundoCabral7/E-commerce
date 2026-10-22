import { Router } from 'express';
import { ProductInteractionController } from '../controllers/product-interaction.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();
const interactionController = new ProductInteractionController();

// Todas as rotas de favoritos exigem autenticação
router.use(authenticate);

// GET /api/favorites — Lista todos os favoritos do usuário
router.get('/', interactionController.getFavorites);

export default router;

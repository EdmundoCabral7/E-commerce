import { Router } from "express";
import { ProductController } from "../controllers/product.controller";
import { authenticate, authMiddleware } from "../middlewares/auth.middleware";
import { ProductInteractionController } from "../controllers/product-interaction.controller";
import { uploadMiddleware } from "../middlewares/upload.middleware";

const router = Router();
const productController = new ProductController();
const interactionController = new ProductInteractionController();

// Rotas de leitura (Públicas ou com Auth base conforme o caso)
router.get('/', productController.findAll);
router.get('/:id', productController.findById);
router.get('/:id/reviews', interactionController.getReviews);
router.get('/:id/questions', interactionController.getQuestions);

/**
 * Rotas Administrativas — Protegidas pelo novo authMiddleware (Admin)
 * POST /api/products — Criação com upload de até 5 imagens
 */
router.post(
    '/', 
    authMiddleware, 
    uploadMiddleware.array('images', 5), 
    productController.create
);

router.put(
    '/:id', 
    authMiddleware, 
    uploadMiddleware.array('images', 5), 
    productController.update
);

router.delete('/:id', authMiddleware, productController.delete);
router.patch('/:id/toggle', authMiddleware, productController.toggleStatus);

router.patch('/questions/:questionId/answer', authMiddleware, interactionController.answerQuestion);
router.delete('/questions/:questionId', authMiddleware, interactionController.deleteQuestion);

router.use(authenticate);
router.post('/:id/questions', interactionController.createQuestion);
router.post('/:id/reviews', interactionController.createReview);
router.post('/:id/favorite', interactionController.toggleFavorite);

export default router;
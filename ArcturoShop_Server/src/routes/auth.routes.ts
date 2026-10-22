import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const authController = new AuthController();

// Rotas públicas — não precisam de autenticação
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rota protegida — Painel Admin
router.get('/me', authMiddleware, authController.me);

export default router;


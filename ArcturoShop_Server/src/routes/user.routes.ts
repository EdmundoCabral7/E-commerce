import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();
const userController = new UserController();

// Todas as rotas de usuário exigem autenticação
router.use(authenticate);

// Rotas de Perfil (Usuário logado)
router.get('/profile', userController.getProfile);
router.patch('/profile', userController.updateProfile);

// GET /api/users  — apenas ADMIN pode listar todos os usuários
router.get('/', requireRole('ADMIN'), userController.findAll);

// GET /api/users/:id — ADMIN ou o próprio usuário
router.get('/:id', userController.findById);

// PATCH /api/users/:id — ADMIN ou o próprio usuário
router.patch('/:id', userController.update);

// DELETE /api/users/:id — apenas ADMIN
router.delete('/:id', requireRole('ADMIN'), userController.delete);

export default router;

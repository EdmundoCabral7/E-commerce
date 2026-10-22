import { Router } from 'express';
import { AdminProductController } from '../../controllers/org/admin-product.controller';
import { DashboardController } from '../../controllers/org/dashboard.controller';
import { organizationMiddleware } from '../../middlewares/org.middleware';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireOrgRole } from '../../middlewares/roles.middleware';
import { OrgRole } from '@prisma/client';
import walletRoutes from '../wallet.routes';
import deliveryRoutes from '../delivery.routes';
import teamRoutes from '../team.routes';
import { uploadMiddleware } from '../../middlewares/upload.middleware';

const router = Router({ mergeParams: true });
const adminProductController = new AdminProductController();
const dashboardController = new DashboardController();

/**
 * Rotas Administrativas (/api/org/:orgId/...)
 * Todas as rotas abaixo herdam o parâmetro :orgId e exigem autenticação.
 */

// Middleware de base para todas as rotas de organização
router.use(authenticate);
router.use(organizationMiddleware);

// --- Gestão de Produtos ---
router.get('/products', adminProductController.findAll);
router.post('/products', requireOrgRole(OrgRole.OWNER, OrgRole.ADMIN), uploadMiddleware.array('images', 5), adminProductController.create);
router.put('/products/:id', requireOrgRole(OrgRole.OWNER, OrgRole.ADMIN), uploadMiddleware.array('images', 5), adminProductController.update);
router.delete('/products/:id', requireOrgRole(OrgRole.OWNER), adminProductController.delete);

// --- Dashboard ---
router.get('/dashboard', dashboardController.getMetrics);

// --- Wallet ---
router.use('/wallet', walletRoutes);

// --- Delivery ---
router.use('/delivery', deliveryRoutes);

// --- Team ---
router.use('/team', teamRoutes);

export default router;

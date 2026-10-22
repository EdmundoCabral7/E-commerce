import { Router } from 'express';
import { SaleController } from '../controllers/sale.controller';
import { organizationMiddleware } from '../middlewares/org.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { requireOrgRole } from '../middlewares/roles.middleware';
import { OrgRole } from '@prisma/client';

const router = Router({ mergeParams: true });
const saleController = new SaleController();

/**
 * Rotas de Vendas (/api/org/:orgId/sales)
 */

// Checkout público (pode ser anônimo ou logado)
// Nota: Usamos authenticate opcionalmente se disponível, ou apenas a rota pública
router.post('/', saleController.checkout);

// Rotas Administrativas Protegidas
router.use(authenticate);
router.use(organizationMiddleware);

router.get(
  '/',
  requireOrgRole(OrgRole.OWNER, OrgRole.ADMIN, OrgRole.STAFF),
  saleController.listSales
);

router.get(
  '/report/summary',
  requireOrgRole(OrgRole.OWNER, OrgRole.ADMIN),
  saleController.getSummary
);

router.get(
  '/:id',
  requireOrgRole(OrgRole.OWNER, OrgRole.ADMIN, OrgRole.STAFF),
  saleController.getDetail
);

router.patch(
  '/:id/status',
  requireOrgRole(OrgRole.OWNER, OrgRole.ADMIN, OrgRole.STAFF),
  saleController.updateStatus
);

export default router;

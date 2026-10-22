import { Router } from 'express';
import { PromotionController } from '../controllers/promotion.controller';
import { organizationMiddleware } from '../middlewares/org.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { requireOrgRole } from '../middlewares/roles.middleware';
import { OrgRole } from '@prisma/client';

const router = Router({ mergeParams: true });
const promotionController = new PromotionController();

/**
 * Rotas de Promoção (/api/org/:orgId/promotions)
 */

// Listagem pública de promoções ativas
router.get('/active', promotionController.getActive);

// Listagem administrativa
router.get(
  '/',
  authenticate,
  organizationMiddleware,
  requireOrgRole(OrgRole.OWNER, OrgRole.ADMIN, OrgRole.STAFF),
  promotionController.getAll
);

// Criação e edição (Apenas OWNER e ADMIN)
router.post(
  '/',
  authenticate,
  organizationMiddleware,
  requireOrgRole(OrgRole.OWNER, OrgRole.ADMIN),
  promotionController.create
);

router.put(
  '/:id',
  authenticate,
  organizationMiddleware,
  requireOrgRole(OrgRole.OWNER, OrgRole.ADMIN),
  promotionController.update
);

router.delete(
  '/:id',
  authenticate,
  organizationMiddleware,
  requireOrgRole(OrgRole.OWNER),
  promotionController.delete
);

export default router;

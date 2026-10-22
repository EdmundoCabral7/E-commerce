import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';
import { organizationMiddleware } from '../middlewares/org.middleware';
import { authenticate } from '../middlewares/auth.middleware';
import { requireOrgRole } from '../middlewares/roles.middleware';
import { uploadCategoryMiddleware } from '../middlewares/upload.middleware';
import { OrgRole } from '@prisma/client';

const router = Router({ mergeParams: true });
const categoryController = new CategoryController();

/**
 * Rotas de Categoria (/api/org/:orgId/categories)
 */

// Listagem pública (dentro do contexto da loja)
router.get('/', categoryController.getAll);

// Rotas administrativas (protegidas)
router.post(
  '/',
  authenticate,
  organizationMiddleware,
  requireOrgRole(OrgRole.OWNER, OrgRole.ADMIN),
  uploadCategoryMiddleware.single('image'),
  categoryController.create
);

router.put(
  '/:id',
  authenticate,
  organizationMiddleware,
  requireOrgRole(OrgRole.OWNER, OrgRole.ADMIN),
  uploadCategoryMiddleware.single('image'),
  categoryController.update
);

router.delete(
  '/:id',
  authenticate,
  organizationMiddleware,
  requireOrgRole(OrgRole.OWNER),
  categoryController.delete
);

export default router;

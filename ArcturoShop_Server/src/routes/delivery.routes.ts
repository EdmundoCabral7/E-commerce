import { Router } from 'express';
import { DeliveryController } from '../controllers/delivery.controller';
import { requireOrgRole } from '../middlewares/roles.middleware';
import { OrgRole } from '@prisma/client';

const router = Router({ mergeParams: true });
const deliveryController = new DeliveryController();

router.get('/', deliveryController.findAll);
router.post('/', requireOrgRole(OrgRole.OWNER, OrgRole.ADMIN), deliveryController.create);
router.put('/:id', requireOrgRole(OrgRole.OWNER, OrgRole.ADMIN), deliveryController.update);
router.delete('/:id', requireOrgRole(OrgRole.OWNER), deliveryController.delete);

export default router;

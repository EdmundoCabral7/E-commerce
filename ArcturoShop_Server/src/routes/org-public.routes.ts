import { Router } from 'express';
import { OrgController } from '../controllers/org.controller';

const router = Router({ mergeParams: true });
const orgController = new OrgController();

router.get('/profile', orgController.getProfile);

export default router;

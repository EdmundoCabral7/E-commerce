import { Router } from 'express';
import { TeamController } from '../controllers/team.controller';
import { requireOrgRole } from '../middlewares/roles.middleware';
import { OrgRole } from '@prisma/client';

const router = Router({ mergeParams: true });
const teamController = new TeamController();

router.get('/', teamController.getMembers);
router.get('/stats', teamController.getStats);
router.post('/', requireOrgRole(OrgRole.OWNER, OrgRole.ADMIN), teamController.addMember);
router.put('/:id/role', requireOrgRole(OrgRole.OWNER, OrgRole.ADMIN), teamController.updateRole);
router.delete('/:id', requireOrgRole(OrgRole.OWNER), teamController.removeMember);
router.post('/invite', requireOrgRole(OrgRole.OWNER, OrgRole.ADMIN), teamController.createInvite);

export default router;

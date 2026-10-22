import { Request, Response, NextFunction } from 'express';
import { TeamService } from '../services/team.service';
import {
  addMemberSchema,
  inviteMemberSchema,
  updateMemberRoleSchema,
} from '../schemas/team.schema';

const teamService = new TeamService();

export class TeamController {
  async getMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await teamService.getMembers(req.params.orgId as string);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await teamService.getStats(req.params.orgId as string);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async addMember(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = addMemberSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
        return;
      }
      const data = await teamService.addMember(
        req.params.orgId as string,
        parsed.data.email,
        parsed.data.role,
      );
      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = updateMemberRoleSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
        return;
      }
      const data = await teamService.updateRole(
        req.params.id as string,
        req.params.orgId as string,
        parsed.data.role,
      );
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      await teamService.removeMember(req.params.id as string, req.params.orgId as string);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async createInvite(req: Request, res: Response, next: NextFunction) {
    try {
      const parsed = inviteMemberSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
        return;
      }
      const data = await teamService.createInvite(
        req.params.orgId as string,
        parsed.data.email,
        parsed.data.role,
      );
      res.status(201).json({ data });
    } catch (error) {
      next(error);
    }
  }
}

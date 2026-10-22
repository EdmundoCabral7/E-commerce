import { Request, Response, NextFunction } from 'express';
import { OrgService } from '../services/org.service';

const orgService = new OrgService();

export class OrgController {
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.params.orgId as string;
      const data = await orgService.getProfile(orgId);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }
}

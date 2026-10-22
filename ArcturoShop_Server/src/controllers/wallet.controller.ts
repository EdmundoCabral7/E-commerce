import { Request, Response, NextFunction } from 'express';
import { WalletService } from '../services/wallet.service';
import { withdrawSchema } from '../schemas/wallet.schema';

const walletService = new WalletService();

export class WalletController {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.params.orgId as string;
      const data = await walletService.getStats(orgId);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.params.orgId as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const data = await walletService.getTransactions(orgId, page, limit);
      res.json({ data: data.items, meta: { total: data.totalCount } });
    } catch (error) {
      next(error);
    }
  }

  async requestWithdrawal(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.params.orgId as string;
      const parsed = withdrawSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({ errors: parsed.error.flatten().fieldErrors });
        return;
      }

      const withdrawal = await walletService.requestWithdrawal(orgId, parsed.data);
      res.status(201).json({ data: withdrawal });
    } catch (error) {
      next(error);
    }
  }

  async getWithdrawals(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.params.orgId as string;
      const data = await walletService.getWithdrawals(orgId);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }

  async getAnalysis(req: Request, res: Response, next: NextFunction) {
    try {
      const orgId = req.params.orgId as string;
      const data = await walletService.getAnalysis(orgId);
      res.json({ data });
    } catch (error) {
      next(error);
    }
  }
}

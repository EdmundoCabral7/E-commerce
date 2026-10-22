import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../../services/org/dashboard.service';

const dashboardService = new DashboardService();

/**
 * Controller do Dashboard Administrativo.
 */
export class DashboardController {
    /**
     * GET /api/org/:orgId/dashboard
     * Retorna métricas consolidadas para o painel do lojista.
     */
    async getMetrics(req: Request, res: Response, next: NextFunction) {
        try {
            const orgId = req.orgId!;
            const metrics = await dashboardService.getMetrics(orgId);

            res.status(200).json({
                success: true,
                data: metrics,
                error: null
            });
        } catch (error) {
            next(error);
        }
    }
}

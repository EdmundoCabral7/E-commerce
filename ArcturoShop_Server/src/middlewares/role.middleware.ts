import { Request, Response, NextFunction } from 'express';

// Middleware de controle de acesso baseado em role (RBAC)
export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Não autenticado.' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Acesso negado. Permissão insuficiente.',
      });
      return;
    }

    next();
  };
}

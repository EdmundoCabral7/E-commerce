import { Request, Response, NextFunction } from 'express';
import { OrgRole } from '@prisma/client';

/**
 * Factory pattern para criar middlewares de autorização baseados em roles de organização.
 * Verifica se o usuário possui um dos papéis (OWNER, ADMIN, STAFF) necessários para a rota.
 * 
 * IMPORTANTE: Este middleware deve ser encadeado APÓS o organizationMiddleware.
 */
export function requireOrgRole(...allowedRoles: OrgRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const memberRole = req.memberRole;

    // Se o memberRole não estiver presente, significa que o context de organização não foi validado
    if (!memberRole) {
      res.status(403).json({
        success: false,
        data: null,
        error: { 
          message: 'Erro de contexto: Permissão de membro não encontrada. Verifique o encadeamento dos middlewares.' 
        }
      });
      return;
    }

    // Verifica se o papel do usuário na organização está na lista de permissões permitidas
    if (!allowedRoles.includes(memberRole)) {
      res.status(403).json({
        success: false,
        data: null,
        error: { 
          message: 'Acesso negado. Seu nível de acesso nesta organização é insuficiente para realizar esta operação.' 
        }
      });
      return;
    }

    next();
  };
}

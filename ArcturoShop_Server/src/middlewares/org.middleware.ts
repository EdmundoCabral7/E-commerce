import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';

/**
 * Middleware para validar se o usuário autenticado pertence à organização.
 * Bloqueia o acesso caso o usuário não seja membro, garantindo isolamento total.
 */
export async function organizationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const orgId = String(req.params.orgId);
    const userId = req.user?.id;

    if (!orgId) {
      res.status(400).json({
        success: false,
        data: null,
        error: { message: 'ID da organização não fornecido na URL.' }
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        data: null,
        error: { message: 'Usuário não autenticado.' }
      });
      return;
    }

    // Busca o vínculo do usuário com a organização no banco de dados
    const membership = await prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId: orgId,
          userId: userId,
        },
      },
    });

    // Se não houver vínculo, bloqueia o acesso (403 Forbidden)
    if (!membership) {
      res.status(403).json({
        success: false,
        data: null,
        error: { message: 'Acesso negado. Você não possui permissão para acessar esta organização.' }
      });
      return;
    }

    // Injeta os dados de contexto no objeto Request
    // Graças à Task 2.1, esses campos estão tipados no Express.Request
    req.orgId = membership.organizationId;
    req.memberRole = membership.role;

    next();
  } catch (error) {
    next(error);
  }
}

import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { updateProfileSchema } from '../schemas/user.schema';

const userService = new UserService();

/**
 * Controller de Usuários.
 * Gerencia as operações de consulta, atualização e remoção de usuários.
 */
export class UserController {


  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user!.id;
      const user = await userService.findByIdWithOrgs(id);
      res.status(200).json({
        success: true,
        data: user,
        error: null
      });
    } catch (error) {
      next(error);
    }
  }


  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.user!.id;
      const parsed = updateProfileSchema.safeParse(req.body);

      if (!parsed.success) {
        res.status(400).json({
          success: false,
          data: null,
          error: {
            message: 'Erro de validação',
            details: parsed.error.flatten().fieldErrors
          }
        });
        return;
      }

      const updated = await userService.update(id, parsed.data);
      res.status(200).json({
        success: true,
        data: {
          message: 'Perfil atualizado com sucesso.',
          user: updated
        },
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users
   * Lista todos os usuários do sistema.
   */
  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.findAll();
      res.status(200).json({
        success: true,
        data: users,
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/users/:id
   * Retorna os detalhes de um usuário específico.
   */
  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const user = await userService.findById(id);
      res.status(200).json({
        success: true,
        data: user,
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/users/:id
   * Atualiza dados de um usuário.
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const { name, email, isActive } = req.body;

      const updated = await userService.update(id, { name, email, isActive });
      res.status(200).json({
        success: true,
        data: {
          message: 'Usuário atualizado com sucesso.',
          user: updated
        },
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/users/:id
   * Remove um usuário do sistema.
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      const result = await userService.delete(id);
      res.status(200).json({
        success: true,
        data: result,
        error: null
      });
    } catch (error) {
      next(error);
    }
  }
}

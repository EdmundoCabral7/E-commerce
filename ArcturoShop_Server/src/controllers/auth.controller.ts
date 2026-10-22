import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { AppError } from '../middlewares/errorHandler';

const authService = new AuthService();

/**
 * Controller de Autenticação.
 * Classe responsável por gerenciar as requisições HTTP de registro e login.
 */
export class AuthController {
  /**
   * POST /api/auth/register
   * Cria uma nova conta de usuário.
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      // Validação rigorosa do corpo da requisição com Zod
      const parsed = registerSchema.safeParse(req.body);

      if (!parsed.success) {
        // Formata os erros do Zod para uma estrutura amigável
        const fieldErrors = parsed.error.flatten().fieldErrors;
        res.status(400).json({
          success: false,
          data: null,
          error: {
            message: 'Erro de validação',
            details: fieldErrors
          }
        });
        return;
      }

      // Chama o service para o processamento da lógica de negócio
      const user = await authService.register(parsed.data);

      // Resposta padronizada de sucesso (201 Created)
      res.status(201).json({
        success: true,
        data: user,
        error: null
      });
    } catch (error) {
      // Delega qualquer erro para o errorHandler global
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Autentica um usuário e retorna o token JWT.
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      // Validação do corpo da requisição com Zod
      const parsed = loginSchema.safeParse(req.body);

      if (!parsed.success) {
        const fieldErrors = parsed.error.flatten().fieldErrors;
        res.status(400).json({
          success: false,
          data: null,
          error: {
            message: 'Erro de validação',
            details: fieldErrors
          }
        });
        return;
      }

      // Chama o service para autenticação (modo admin habilitado)
      const result = await authService.login(parsed.data, false);


      // Resposta padronizada de sucesso (200 OK)
      res.status(200).json({
        success: true,
        data: result,
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Retorna os dados do administrador autenticado.
   */
  async me(req: Request, res: Response) {
    res.status(200).json({
      success: true,
      data: req.admin,
      error: null
    });
  }
}

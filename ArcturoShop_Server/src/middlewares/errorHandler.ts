import { Request, Response, NextFunction } from 'express';

/**
 * Classe customizada para erros operacionais da aplicação.
 * Permite definir uma mensagem clara e um status HTTP adequado.
 */
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    // Garante que a instância seja reconhecida corretamente como AppError
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Middleware global de tratamento de erros.
 * Deve ser o último middleware registrado no app.ts.
 */
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Se for um erro conhecido da aplicação (AppError)
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      data: null,
      error: {
        message: error.message,
      },
    });
    return;
  }

  // Log de erros inesperados para depuração
  console.error('❌ Erro inesperado:', error);

  // Resposta genérica para erros desconhecidos (segurança)
  res.status(500).json({
    success: false,
    data: null,
    error: {
      message: 'Erro interno do servidor',
    },
  });
}

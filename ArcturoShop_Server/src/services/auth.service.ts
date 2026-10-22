import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../middlewares/errorHandler';
import { RegisterInput, LoginInput } from '../validators/auth.validator';

const userRepository = new UserRepository();

/**
 * Service de Autenticação.
 * Centraliza as regras de negócio para registro e login,
 * garantindo segurança e integridade dos dados.
 */
export class AuthService {
  /**
   * Registra um novo usuário no sistema.
   * Valida duplicidade de e-mail e faz o hash da senha.
   */
  async register(data: RegisterInput) {
    const { name, email, password } = data;

    // Verifica se e-mail já está em uso via repositório
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('E-mail já cadastrado.', 409); // 409 Conflict
    }

    // Gera o hash da senha de forma segura
    const passwordHash = await bcrypt.hash(password, 10);

    // Salva o usuário no banco de dados
    const user = await userRepository.create({
      name,
      email,
      passwordHash,
    });

    // Retorna o usuário sem o hash da senha (segurança)
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }

  /**
   * Autentica um usuário e gera um token JWT.
   */
  async login(data: LoginInput, isAdminLogin: boolean = false) {
    const { email, password } = data;

    // Busca o usuário pelo e-mail
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    // Verifica se a conta está ativa
    if (!user.isActive) {
      throw new AppError('Conta desativada. Entre em contato com o suporte.', 403);
    }

    // Se for um login administrativo, valida o cargo
    if (isAdminLogin && user.role !== 'ADMIN') {
      throw new AppError('Acesso negado. Apenas administradores podem acessar esta área.', 403);
    }

    // Compara a senha enviada com o hash do banco
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new AppError('Credenciais inválidas.', 401);
    }

    // Para admins a expiração é de 24h, para usuários comuns segue o env
    const expiresIn = isAdminLogin ? '24h' : (env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn']);

    // Gera o token JWT com payload reduzido
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}

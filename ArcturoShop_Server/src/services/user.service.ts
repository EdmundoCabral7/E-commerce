import { UserRepository } from '../repositories/user.repository';
import { AppError } from '../middlewares/errorHandler';

const userRepository = new UserRepository();

export interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string | null;
  bio?: string | null;
  isActive?: boolean;
}

/**
 * Service de Usuários.
 * Gerencia operações de CRUD e lógica de negócio para a entidade User.
 */
export class UserService {
  /**
   * Lista todos os usuários (sem o passwordHash).
   */
  async findAll() {
    return userRepository.findAll();
  }

  /**
   * Busca um usuário por ID e lança erro caso não exista.
   */
  async findById(id: string) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findByIdWithOrgs(id: string) {
    const user = await userRepository.findByIdWithOrgs(id);

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Atualiza dados do usuário.
   */
  async update(id: string, data: UpdateUserData) {
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    // Se for atualizar o e-mail, verificar duplicidade
    if (data.email && data.email !== existing.email) {
      const emailInUse = await userRepository.findByEmail(data.email);
      if (emailInUse) {
        throw new AppError('Este e-mail já está em uso.', 409);
      }
    }

    const updated = await userRepository.update(id, data);
    const { passwordHash, ...userWithoutPassword } = updated;
    return userWithoutPassword;
  }

  /**
   * Deleta um usuário do sistema.
   */
  async delete(id: string) {
    const existing = await userRepository.findById(id);
    if (!existing) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    await userRepository.delete(id);
    return { message: 'Usuário removido com sucesso.' };
  }
}

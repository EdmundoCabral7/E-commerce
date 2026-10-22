import { Prisma, User } from '@prisma/client';
import prisma from '../config/prisma';

/**
 * Repositório de Usuários.
 * Isola o acesso ao banco de dados, permitindo que os services fiquem limpos
 * e independentes da implementação direta da ORM.
 */
export class UserRepository {
  /**
   * Busca um usuário pelo e-mail (campo único).
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Busca um usuário pelo ID.
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByIdWithOrgs(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        memberships: {
          include: { organization: true },
        },
      },
    });
  }

  /**
   * Cria um novo usuário no banco de dados.
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  /**
   * Lista todos os usuários.
   */
  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Atualiza dados de um usuário existente.
   */
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Remove um usuário do banco de dados.
   */
  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}

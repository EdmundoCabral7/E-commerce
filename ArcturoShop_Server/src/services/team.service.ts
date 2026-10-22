import { OrgRole } from '@prisma/client';
import { AppError } from '../middlewares/errorHandler';
import { TeamRepository } from '../repositories/team.repository';
import prisma from '../config/prisma';
import { env } from '../config/env';

const teamRepository = new TeamRepository();

export class TeamService {
  async getMembers(orgId: string) {
    return teamRepository.findMembers(orgId);
  }

  async getStats(orgId: string) {
    return teamRepository.getOrgStats(orgId);
  }

  async addMember(orgId: string, email: string, role: OrgRole) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('Nenhum usuário encontrado com este e-mail.', 404);

    const existing = await teamRepository.findMemberByUserId(orgId, user.id);
    if (existing) throw new AppError('Este usuário já é membro desta organização.', 409);

    return teamRepository.addMember(orgId, user.id, role);
  }

  async updateRole(id: string, orgId: string, role: OrgRole) {
    const member = await teamRepository.findMemberById(id, orgId);
    if (!member) throw new AppError('Membro não encontrado.', 404);
    if (member.role === OrgRole.OWNER) throw new AppError('Não é possível alterar o cargo do proprietário.', 403);
    return teamRepository.updateRole(id, role);
  }

  async removeMember(id: string, orgId: string) {
    const member = await teamRepository.findMemberById(id, orgId);
    if (!member) throw new AppError('Membro não encontrado.', 404);
    if (member.role === OrgRole.OWNER) throw new AppError('Não é possível remover o proprietário.', 403);
    return teamRepository.removeMember(id);
  }

  async createInvite(orgId: string, email: string, role: OrgRole) {
    const invite = await teamRepository.createInvite(orgId, email, role);
    const baseUrl = env.FRONTEND_URL ?? 'http://localhost:3000';
    return { ...invite, inviteUrl: `${baseUrl}/invite/${invite.token}` };
  }
}

import { z } from 'zod';
import { OrgRole } from '@prisma/client';

const orgRoleEnum = z.nativeEnum(OrgRole);

export const addMemberSchema = z.object({
  email: z.string().email('E-mail inválido'),
  role: orgRoleEnum.default(OrgRole.STAFF),
});

export const inviteMemberSchema = z.object({
  email: z.string().email('E-mail inválido'),
  role: orgRoleEnum.default(OrgRole.STAFF),
});

export const updateMemberRoleSchema = z.object({
  role: orgRoleEnum,
});

export type AddMemberDTO = z.infer<typeof addMemberSchema>;
export type InviteMemberDTO = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberRoleDTO = z.infer<typeof updateMemberRoleSchema>;

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTeamMembers,
  getTeamStats,
  addTeamMember,
  updateMemberRole,
  removeTeamMember,
  inviteTeamMember,
  AddMemberPayload,
  InviteMemberPayload,
} from "@/lib/api/team-service";

export const useTeamMembers = () =>
  useQuery({ queryKey: ["team", "members"], queryFn: getTeamMembers });

export const useTeamStats = () =>
  useQuery({ queryKey: ["team", "stats"], queryFn: getTeamStats });

export const useAddMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddMemberPayload) => addTeamMember(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team"] }),
  });
};

export const useUpdateMemberRole = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: AddMemberPayload["role"] }) =>
      updateMemberRole(id, role),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team"] }),
  });
};

export const useRemoveMember = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => removeTeamMember(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["team"] }),
  });
};

export const useInviteMember = () =>
  useMutation({
    mutationFn: (payload: InviteMemberPayload) => inviteTeamMember(payload),
  });

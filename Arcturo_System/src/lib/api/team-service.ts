import { api, buildOrgUrl } from "./axios";

export interface TeamMember {
  id: string;
  role: "OWNER" | "ADMIN" | "STAFF";
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export interface TeamStats {
  memberCount: number;
  totalRevenue: number;
  totalOrders: number;
}

export interface AddMemberPayload {
  email: string;
  role: "OWNER" | "ADMIN" | "STAFF";
}

export interface InviteMemberPayload {
  email: string;
  role: "OWNER" | "ADMIN" | "STAFF";
}

export interface InviteResponse {
  id: string;
  email: string;
  role: string;
  token: string;
  inviteUrl: string;
  expiresAt: string;
}

export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const url = buildOrgUrl("/team");
  const response = await api.get(url);
  return response.data.data ?? [];
};

export const getTeamStats = async (): Promise<TeamStats> => {
  const url = buildOrgUrl("/team/stats");
  const response = await api.get(url);
  return response.data.data;
};

export const addTeamMember = async (payload: AddMemberPayload): Promise<TeamMember> => {
  const url = buildOrgUrl("/team");
  const response = await api.post(url, payload);
  return response.data.data;
};

export const updateMemberRole = async (
  id: string,
  role: AddMemberPayload["role"]
): Promise<TeamMember> => {
  const url = buildOrgUrl(`/team/${id}/role`);
  const response = await api.put(url, { role });
  return response.data.data;
};

export const removeTeamMember = async (id: string): Promise<void> => {
  const url = buildOrgUrl(`/team/${id}`);
  await api.delete(url);
};

export const inviteTeamMember = async (
  payload: InviteMemberPayload
): Promise<InviteResponse> => {
  const url = buildOrgUrl("/team/invite");
  const response = await api.post(url, payload);
  return response.data.data;
};

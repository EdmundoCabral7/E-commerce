import { api } from "./axios";

export interface OrgProfile {
  id: string;
  name: string;
  createdAt: string;
  totalOrders: number;
  totalMembers: number;
}

export const getOrgProfile = async (orgId: string): Promise<OrgProfile> => {
  const response = await api.get(`/org/${orgId}/profile`);
  return response.data.data;
};

import { api, buildOrgUrl } from "./axios";

export interface WalletStats {
  totalBalance: number;
  pendingPayout: number;
  gatewayFees: number;
  netProfit: number;
  monthlyRevenue: number;
}

export interface WalletTransaction {
  id: string;
  createdAt: string;
  paymentMethod: string;
  status: string;
  total: number | string;
  discount: number | string;
  buyerName: string;
  items: Array<{ product: { name: string } }>;
}

export interface WalletTransactionsResponse {
  data: WalletTransaction[];
  meta: { total: number };
}

export interface WithdrawPayload {
  fullName: string;
  document: string;
  pixKey: string;
  pixType: string;
  amount: number;
}

export const getWalletStats = async (): Promise<WalletStats> => {
  const url = buildOrgUrl("/wallet/stats");
  const response = await api.get(url);
  return response.data.data;
};

export const getWalletTransactions = async (params?: {
  page?: number;
  limit?: number;
}): Promise<WalletTransactionsResponse> => {
  const url = buildOrgUrl("/wallet/transactions");
  const response = await api.get(url, { params });
  return { data: response.data.data ?? [], meta: response.data.meta ?? { total: 0 } };
};

export const requestWithdraw = async (payload: WithdrawPayload): Promise<void> => {
  const url = buildOrgUrl("/wallet/withdraw");
  await api.post(url, payload);
};

export interface WalletAnalysis {
  conversionRate: number;
  avgTicket: number;
  schedule: Array<{ date: string; amount: number }>;
}

export const getWalletAnalysis = async (): Promise<WalletAnalysis> => {
  const url = buildOrgUrl("/wallet/analysis");
  const response = await api.get(url);
  return response.data.data;
};

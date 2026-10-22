import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getWalletStats,
  getWalletTransactions,
  getWalletAnalysis,
  requestWithdraw,
  WithdrawPayload,
} from "@/lib/api/wallet-service";

export const useWalletStats = () =>
  useQuery({ queryKey: ["wallet", "stats"], queryFn: getWalletStats });

export const useWalletTransactions = (page: number = 1, limit: number = 10) =>
  useQuery({
    queryKey: ["wallet", "transactions", page, limit],
    queryFn: () => getWalletTransactions({ page, limit }),
  });

export const useWalletAnalysis = () =>
  useQuery({ queryKey: ["wallet", "analysis"], queryFn: getWalletAnalysis });

export const useWithdraw = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: WithdrawPayload) => requestWithdraw(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["wallet"] });
    },
  });
};

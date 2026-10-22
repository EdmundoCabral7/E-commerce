import { AppError } from '../middlewares/errorHandler';
import { WalletRepository } from '../repositories/wallet.repository';
import { WithdrawDTO } from '../schemas/wallet.schema';

const walletRepository = new WalletRepository();

export class WalletService {
  async getStats(orgId: string) {
    return walletRepository.getStats(orgId);
  }

  async getTransactions(orgId: string, page: number, limit: number) {
    return walletRepository.getTransactions(orgId, page, limit);
  }

  async requestWithdrawal(orgId: string, data: WithdrawDTO) {
    const stats = await walletRepository.getStats(orgId);

    if (data.amount > stats.netProfit) {
      throw new AppError('Saldo insuficiente para saque.', 400);
    }

    return walletRepository.createWithdrawal(orgId, data);
  }

  async getWithdrawals(orgId: string) {
    return walletRepository.getWithdrawals(orgId);
  }

  async getAnalysis(orgId: string) {
    return walletRepository.getAnalysis(orgId);
  }
}

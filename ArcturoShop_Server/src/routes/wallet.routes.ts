import { Router } from 'express';
import { WalletController } from '../controllers/wallet.controller';

const router = Router({ mergeParams: true });
const walletController = new WalletController();

router.get('/stats', walletController.getStats);
router.get('/transactions', walletController.getTransactions);
router.get('/withdrawals', walletController.getWithdrawals);
router.get('/analysis', walletController.getAnalysis);
router.post('/withdraw', walletController.requestWithdrawal);

export default router;

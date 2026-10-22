import { WalletHeader } from "@/components/wallet/WalletHeader"
import { WalletStats } from "@/components/wallet/WalletStats"
import { WalletAnalysis } from "@/components/wallet/WalletAnalysis"
import { WalletTransactions } from "@/components/wallet/WalletTransactions"

export default function WalletPage() {
    return (
        <div className="flex flex-col gap-2">
            <WalletHeader />
            <WalletStats />
            <WalletAnalysis />
            <WalletTransactions />
        </div>
    )
}

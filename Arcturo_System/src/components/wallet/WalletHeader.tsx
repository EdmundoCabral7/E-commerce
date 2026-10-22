import { WithdrawModal } from "./WithdrawModal"

export function WalletHeader() {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col gap-1">
                <div className="text-2xl font-black tracking-tight text-content-primary sm:text-4xl font-heading break-words leading-tight">Carteira</div>
                <div className="text-sm text-content-muted font-medium">Monitore o desempenho financeiro e saldos das contas em tempo real.</div>
            </div>
            <div className="flex items-center gap-3">
                <WithdrawModal />
            </div>
        </div>
    )
}

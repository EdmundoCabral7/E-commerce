"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import {
    Banknote,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useWithdraw } from "@/lib/hooks/useWallet"
import { Form } from "@/components/ui/form"

const withdrawFormSchema = z.object({
    fullName: z.string().min(5, "Nome completo é necessário"),
    document: z.string().min(11, "CPF ou CNPJ inválido"),
    pixKey: z.string().min(1, "Chave PIX é necessária"),
    pixType: z.string().min(1, "Selecione o tipo de chave"),
    amount: z.string().min(1, "Informe o valor do saque"),
})
type WithdrawFormValues = z.infer<typeof withdrawFormSchema>

export function WithdrawModal() {
    const [open, setOpen] = useState(false)
    const { mutateAsync, isPending } = useWithdraw()

    const form = useForm<WithdrawFormValues>({
        resolver: zodResolver(withdrawFormSchema),
        defaultValues: {
            fullName: "",
            document: "",
            pixKey: "",
            pixType: "",
            amount: "",
        },
    })
    const { control, handleSubmit, reset, setError } = form

    async function onSubmit(data: WithdrawFormValues) {
        const amountNumber = parseFloat(data.amount.replace(",", "."))
        if (isNaN(amountNumber) || amountNumber <= 0) {
            setError("amount", { message: "Informe um valor válido" })
            return
        }
        await mutateAsync({
            fullName: data.fullName,
            document: data.document,
            pixKey: data.pixKey,
            pixType: data.pixType,
            amount: amountNumber,
        })
        reset()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) reset() }}>
            <DialogTrigger render={
                <Button variant="premium" size="premium" onClick={() => setOpen(true)} />
            }>
                <Banknote className="h-5 w-5" />
                Solicitar Saque
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:max-w-md mx-auto p-0 overflow-hidden border-none shadow-none rounded-2xl">
                <div className="p-5 sm:p-8 space-y-6 sm:space-y-8 bg-obsidian-card">
                    <DialogHeader>
                        <DialogTitle className="text-xl sm:text-2xl font-heading text-content-primary">
                            Solicitar Saque
                        </DialogTitle>
                        <DialogDescription className="text-content-muted font-medium text-sm sm:text-base">
                            Informe os dados para transferência do seu saldo via PIX.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}><form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                             <label className="text-[11px] font-bold text-content-muted uppercase tracking-widest ml-1">Favorecido</label>
                            <Controller
                                name="fullName"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Nome completo do titular"
                                        variant="premium"
                                        size="premium"
                                        className="w-full"
                                    />
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                 <label className="text-[11px] font-bold text-content-muted uppercase tracking-widest ml-1">CPF / CNPJ</label>
                                <Controller
                                    name="document"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="000.000.000-00"
                                            variant="premium"
                                            size="premium"
                                            className="w-full"
                                        />
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                 <label className="text-[11px] font-bold text-content-muted uppercase tracking-widest ml-1">Valor (R$)</label>
                                <Controller
                                    name="amount"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="0,00"
                                            variant="premium"
                                            size="premium"
                                            className="font-bold w-full"
                                        />
                                    )}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                             <label className="text-[11px] font-bold text-content-muted uppercase tracking-widest ml-1">Chave PIX</label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="sm:col-span-1">
                                    <Controller
                                        name="pixType"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger size="premium" className="w-full">
                                                    <SelectValue placeholder="Tipo" />
                                                </SelectTrigger>
                                                 <SelectContent className="bg-obsidian-nav border-border text-content-primary rounded-xl">
                                                    <SelectItem value="CPF">CPF</SelectItem>
                                                    <SelectItem value="E-mail">E-mail</SelectItem>
                                                    <SelectItem value="Telefone">Tel</SelectItem>
                                                    <SelectItem value="Aleatório">Chave</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Controller
                                        name="pixKey"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder="Insira a chave"
                                                variant="premium"
                                                size="premium"
                                                className="w-full"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => reset()}
                                 className="font-bold text-content-muted hover:text-content-primary w-full sm:w-auto"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="premium"
                                size="premium"
                                className="w-full sm:w-auto sm:px-10"
                                disabled={isPending}
                            >
                                {isPending ? "Enviando..." : "Solicitar Saque"}
                            </Button>
                        </div>
                    </form></Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

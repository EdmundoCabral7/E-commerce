"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { useCreateDeliveryRegion, useUpdateDeliveryRegion } from "@/lib/hooks/useDelivery";
import { DeliveryRegion } from "@/lib/api/delivery-service";

const regionSchema = z.object({
    cidade: z.string().min(2, "Cidade é obrigatória"),
    regiao: z.string().min(2, "Região é obrigatória"),
    tipo: z.string().min(2, "Tipo de entrega é obrigatório"),
    preco: z.string().min(1, "Preço é obrigatório"),
});

type RegionFormValues = z.infer<typeof regionSchema>;

interface AddRegionModalProps {
    editTarget?: DeliveryRegion | null;
    onClose?: () => void;
}

export function AddRegionModal({ editTarget, onClose }: AddRegionModalProps) {
    const [open, setOpen] = useState(false);
    const { mutateAsync: create, isPending: isCreating } = useCreateDeliveryRegion();
    const { mutateAsync: update, isPending: isUpdating } = useUpdateDeliveryRegion();

    const isPending = isCreating || isUpdating;

    const form = useForm<RegionFormValues>({
        resolver: zodResolver(regionSchema),
        defaultValues: { cidade: "", regiao: "", tipo: "", preco: "" },
    });
    const { control, handleSubmit, reset } = form;

    useEffect(() => {
        if (editTarget) {
            reset({
                cidade: editTarget.cidade,
                regiao: editTarget.regiao,
                tipo: editTarget.tipo,
                preco: String(editTarget.preco),
            });
            setOpen(true);
        }
    }, [editTarget, reset]);

    function handleClose() {
        setOpen(false);
        reset({ cidade: "", regiao: "", tipo: "", preco: "" });
        onClose?.();
    }

    async function onSubmit(data: RegionFormValues) {
        const preco = parseFloat(data.preco.replace(",", "."));
        const payload = { cidade: data.cidade, regiao: data.regiao, tipo: data.tipo, preco };

        if (editTarget) {
            await update({ id: editTarget.id, payload });
        } else {
            await create(payload);
        }

        handleClose();
    }

    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else setOpen(true); }}>
            <DialogTrigger render={
                <Button variant="premium" size="premium" onClick={() => setOpen(true)} />
            }>
                <Plus className="h-5 w-5" />
                Adicionar Região
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:max-w-md mx-auto p-0 overflow-hidden border-none shadow-none rounded-2xl bg-obsidian-card">
                <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                    <DialogHeader>
                        <DialogTitle className="text-xl sm:text-2xl font-heading text-content-primary">
                            {editTarget ? "Editar Região" : "Nova Região"}
                        </DialogTitle>
                        <DialogDescription className="text-content-muted font-medium text-sm sm:text-base">
                            {editTarget
                                ? "Atualize os dados da localidade e taxa de entrega."
                                : "Cadastre uma nova localidade e defina as taxas de entrega."}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}><form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-content-muted uppercase tracking-widest ml-1">Cidade</label>
                            <Controller
                                name="cidade"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Ex: São Paulo - SP" variant="premium" size="premium" className="w-full" />
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-content-muted uppercase tracking-widest ml-1">Região / Zona</label>
                            <Controller
                                name="regiao"
                                control={control}
                                render={({ field }) => (
                                    <Input {...field} placeholder="Ex: Capital, Zona Sul..." variant="premium" size="premium" className="w-full" />
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-content-muted uppercase tracking-widest ml-1">Modalidade</label>
                                <Controller
                                    name="tipo"
                                    control={control}
                                    render={({ field }) => (
                                        <Input {...field} placeholder="Ex: Motoboy" variant="premium" size="premium" className="w-full" />
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-bold text-content-muted uppercase tracking-widest ml-1">Taxa (R$)</label>
                                <Controller
                                    name="preco"
                                    control={control}
                                    render={({ field }) => {
                                        const numVal = parseFloat(field.value.replace(",", ".")) || 0
                                        const display = numVal > 0
                                            ? numVal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                                            : "R$ 0,00"
                                        return (
                                            <Input
                                                inputMode="numeric"
                                                placeholder="R$ 0,00"
                                                variant="premium"
                                                size="premium"
                                                className="w-full"
                                                value={display}
                                                onChange={(e) => {
                                                    const digits = e.target.value.replace(/\D/g, "")
                                                    const cents = parseInt(digits || "0", 10)
                                                    field.onChange((cents / 100).toFixed(2).replace(".", ","))
                                                }}
                                            />
                                        )
                                    }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4">
                            <DialogClose render={
                                <Button type="button" variant="ghost" onClick={handleClose} className="font-bold text-content-muted hover:text-content-primary hover:bg-obsidian-hover w-full sm:w-auto" />
                            }>
                                Cancelar
                            </DialogClose>
                            <Button type="submit" variant="premium" size="premium" className="w-full sm:w-auto sm:px-10" disabled={isPending}>
                                {isPending ? "Salvando..." : "Salvar Região"}
                            </Button>
                        </div>
                    </form></Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

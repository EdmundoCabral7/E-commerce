"use client";

import { useEffect, useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreatePromotion, useUpdatePromotion } from "@/lib/hooks/usePromotions";
import { Form } from "@/components/ui/form";
import { Promotion } from "@/lib/api/promotion-service";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const schema = z.object({
    name: z.string().min(3, "Nome muito curto"),
    type: z.enum(["PERCENTAGE", "FIXED"], { error: "Selecione o tipo" }),
    value: z.number({ error: "Informe o valor" }).positive("Deve ser positivo"),
    startDate: z.string().min(1, "Data obrigatória"),
    endDate: z.string().min(1, "Data obrigatória"),
    minOrderValue: z.number().min(0).optional(),
});

type FormValues = {
    name: string;
    type: "PERCENTAGE" | "FIXED";
    value: number;
    startDate: string;
    endDate: string;
    minOrderValue?: number;
};

interface Props {
    editing?: Promotion | null;
    onClose?: () => void;
}

export function CouponFormModal({ editing, onClose }: Props) {
    const [open, setOpen] = useState(false);
    const isEditing = !!editing;

    const { mutateAsync: create, isPending: creating } = useCreatePromotion();
    const { mutateAsync: update, isPending: updating } = useUpdatePromotion();
    const isPending = creating || updating;

    const toDateInput = (iso: string) => iso ? iso.slice(0, 10) : "";

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            type: "PERCENTAGE",
            value: undefined as unknown as number,
            startDate: "",
            endDate: "",
            minOrderValue: 0,
        },
    });
    const { control, handleSubmit, reset, formState: { errors } } = form;

    useEffect(() => {
        if (editing) {
            reset({
                name: editing.name,
                type: editing.type,
                value: editing.value,
                startDate: toDateInput(editing.startDate),
                endDate: toDateInput(editing.endDate),
                minOrderValue: editing.minOrderValue ?? 0,
            });
            setOpen(true);
        }
    }, [editing, reset]);

    const promoType = useWatch({ control, name: "type" });

    const handleClose = (val: boolean) => {
        setOpen(val);
        if (!val) {
            reset();
            onClose?.();
        }
    };

    const onSubmit = async (data: FormValues): Promise<void> => {
        try {
            const payload = {
                name: data.name,
                type: data.type,
                value: data.value,
                startDate: new Date(data.startDate).toISOString(),
                endDate: new Date(data.endDate).toISOString(),
                minOrderValue: data.minOrderValue ?? 0,
            };
            if (isEditing && editing) {
                await update({ id: editing.id, data: payload });
                toast.success("Promoção atualizada");
            } else {
                await create(payload);
                toast.success("Promoção criada");
            }
            handleClose(false);
        } catch {
            toast.error("Erro ao salvar promoção");
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            {!isEditing && (
                <Button
                    onClick={() => setOpen(true)}
                    className="bg-gold text-obsidian-nav hover:bg-gold/90 h-10 px-5 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Nova Promoção
                </Button>
            )}

            <DialogContent className="w-[95vw] sm:max-w-md mx-auto p-0 overflow-hidden border-border rounded-2xl bg-obsidian-card">
                <div className="p-6 sm:p-8 space-y-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-content-primary uppercase tracking-widest">
                            {isEditing ? "Editar Promoção" : "Nova Promoção"}
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}><form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-content-muted uppercase tracking-widest ml-1">Nome</label>
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Ex: Black Friday 20%"
                                        className="h-11 rounded-xl border-border bg-obsidian-nav text-content-primary placeholder:text-content-muted/30"
                                    />
                                )}
                            />
                            {errors.name && <p className="text-xs text-red-400 ml-1">{errors.name.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-content-muted uppercase tracking-widest ml-1">Tipo</label>
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="h-11 rounded-xl border-border bg-obsidian-nav text-content-primary w-full">
                                                <SelectValue placeholder="Tipo">
                                                    {field.value === "PERCENTAGE" ? "Porcentagem (%)" : "Valor Fixo (R$)"}
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent className="bg-obsidian-nav border-border rounded-xl">
                                                <SelectItem value="PERCENTAGE">Porcentagem (%)</SelectItem>
                                                <SelectItem value="FIXED">Valor Fixo (R$)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-content-muted uppercase tracking-widest ml-1">
                                    {promoType === "PERCENTAGE" ? "Valor (%)" : "Valor (R$)"}
                                </label>
                                <Controller
                                    name="value"
                                    control={control}
                                    render={({ field }) => {
                                        if (promoType === "PERCENTAGE") {
                                            return (
                                                <Input
                                                    inputMode="numeric"
                                                    placeholder="0%"
                                                    className="h-11 rounded-xl border-border bg-obsidian-nav text-content-primary placeholder:text-content-muted/30"
                                                    value={field.value ? `${field.value}%` : ""}
                                                    onChange={(e) => {
                                                        const digits = e.target.value.replace(/\D/g, "")
                                                        const num = parseInt(digits || "0", 10)
                                                        field.onChange(Math.min(num, 100))
                                                    }}
                                                />
                                            )
                                        }
                                        const display = field.value
                                            ? field.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                                            : "R$ 0,00"
                                        return (
                                            <Input
                                                inputMode="numeric"
                                                placeholder="R$ 0,00"
                                                className="h-11 rounded-xl border-border bg-obsidian-nav text-content-primary placeholder:text-content-muted/30"
                                                value={display}
                                                onChange={(e) => {
                                                    const digits = e.target.value.replace(/\D/g, "")
                                                    const cents = parseInt(digits || "0", 10)
                                                    field.onChange(cents / 100)
                                                }}
                                            />
                                        )
                                    }}
                                />
                                {errors.value && <p className="text-xs text-red-400 ml-1">{errors.value.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-content-muted uppercase tracking-widest ml-1">Início</label>
                                <Controller
                                    name="startDate"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="date"
                                            className="h-11 rounded-xl border-border bg-obsidian-nav text-content-primary"
                                        />
                                    )}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-content-muted uppercase tracking-widest ml-1">Fim</label>
                                <Controller
                                    name="endDate"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="date"
                                            className="h-11 rounded-xl border-border bg-obsidian-nav text-content-primary"
                                        />
                                    )}
                                />
                                {errors.endDate && <p className="text-xs text-red-400 ml-1">{errors.endDate.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-content-muted uppercase tracking-widest ml-1">Pedido mínimo (R$)</label>
                            <Controller
                                name="minOrderValue"
                                control={control}
                                render={({ field }) => {
                                    const display = field.value
                                        ? (field.value as number).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                                        : "R$ 0,00"
                                    return (
                                        <Input
                                            inputMode="numeric"
                                            placeholder="R$ 0,00"
                                            className="h-11 rounded-xl border-border bg-obsidian-nav text-content-primary placeholder:text-content-muted/30"
                                            value={display}
                                            onChange={(e) => {
                                                const digits = e.target.value.replace(/\D/g, "")
                                                const cents = parseInt(digits || "0", 10)
                                                field.onChange(cents / 100)
                                            }}
                                        />
                                    )
                                }}
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => handleClose(false)}
                                className="font-bold text-content-muted hover:text-content-primary hover:bg-obsidian-hover"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="bg-gold text-obsidian-nav hover:bg-gold/90 px-8 h-10 rounded-xl font-black uppercase tracking-widest text-[10px]"
                            >
                                {isPending ? "Salvando..." : isEditing ? "Salvar" : "Criar"}
                            </Button>
                        </div>
                    </form></Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}

"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { useCreateCategory, useUpdateCategory } from "@/lib/hooks/useProducts"
import { Category } from "@/lib/types/product"

const schema = z.object({
    name: z.string().min(2, "Nome muito curto"),
    description: z.string().optional(),
})

type FormValues = { name: string; description?: string }

interface Props {
    editing?: Category | null
    onClose?: () => void
}

export function CategoryFormModal({ editing, onClose }: Props) {
    const [open, setOpen] = useState(false)
    const isEditing = !!editing

    const { mutateAsync: create, isPending: creating } = useCreateCategory()
    const { mutateAsync: update, isPending: updating } = useUpdateCategory()
    const isPending = creating || updating

    const { control, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: "", description: "" },
    })

    useEffect(() => {
        if (editing) {
            reset({ name: editing.name, description: editing.description ?? "" })
            setOpen(true)
        }
    }, [editing, reset])

    const handleClose = (val: boolean) => {
        setOpen(val)
        if (!val) { reset(); onClose?.() }
    }

    const onSubmit = async (data: FormValues): Promise<void> => {
        try {
            if (isEditing && editing) {
                await update({ id: editing.id, data })
                toast.success("Categoria atualizada")
            } else {
                await create(data)
                toast.success("Categoria criada")
            }
            handleClose(false)
        } catch {
            toast.error("Erro ao salvar categoria")
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            {!isEditing && (
                <Button
                    onClick={() => setOpen(true)}
                    className="bg-gold text-obsidian-nav hover:bg-gold/90 h-10 px-5 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Nova Categoria
                </Button>
            )}

            <DialogContent className="w-[95vw] sm:max-w-md mx-auto p-0 overflow-hidden border-border rounded-2xl bg-obsidian-card">
                <div className="p-6 sm:p-8 space-y-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-content-primary uppercase tracking-widest">
                            {isEditing ? "Editar Categoria" : "Nova Categoria"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-content-muted uppercase tracking-widest ml-1">Nome</label>
                            <Controller name="name" control={control} render={({ field }) => (
                                <Input {...field} placeholder="Ex: Camisetas, Acessórios..." className="h-11 rounded-xl border-border bg-obsidian-nav text-content-primary placeholder:text-content-muted/30" />
                            )} />
                            {errors.name && <p className="text-xs text-red-400 ml-1">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-content-muted uppercase tracking-widest ml-1">Descrição</label>
                            <Controller name="description" control={control} render={({ field }) => (
                                <Input {...field} placeholder="Breve descrição da categoria" className="h-11 rounded-xl border-border bg-obsidian-nav text-content-primary placeholder:text-content-muted/30" />
                            )} />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button type="button" variant="ghost" onClick={() => handleClose(false)}
                                className="font-bold text-content-muted hover:text-content-primary hover:bg-obsidian-hover">
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isPending}
                                className="bg-gold text-obsidian-nav hover:bg-gold/90 px-8 h-10 rounded-xl font-black uppercase tracking-widest text-[10px]">
                                {isPending ? "Salvando..." : isEditing ? "Salvar" : "Criar"}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

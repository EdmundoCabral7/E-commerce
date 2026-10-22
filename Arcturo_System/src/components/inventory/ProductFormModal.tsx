"use client"

import { useEffect, useRef, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImagePlus, PackagePlus, X } from "lucide-react"
import { toast } from "sonner"
import { useCreateProduct, useUpdateProduct } from "@/lib/hooks/useAdminProducts"
import { Form } from "@/components/ui/form"
import { useCategories } from "@/lib/hooks/useProducts"
import { useUserStore } from "@/lib/store/useUserStore"
import { Product } from "@/lib/types/product"

const schema = z.object({
    name: z.string().min(3, "Nome muito curto"),
    description: z.string().optional(),
    price: z.number({ error: "Informe o preço" }).positive("Deve ser positivo"),
    stock: z.number({ error: "Informe o estoque" }).int().min(0, "Não pode ser negativo"),
    categoryId: z.string().optional(),
    isActive: z.boolean().optional(),
})

type FormValues = {
    name: string
    description?: string
    price: number
    stock: number
    categoryId?: string
    isActive?: boolean
}

interface Props {
    editing?: Product | null
    onClose?: () => void
}

export function ProductFormModal({ editing, onClose }: Props) {
    const [open, setOpen] = useState(false)
    const [imageFiles, setImageFiles] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const isEditing = !!editing

    const { orgId } = useUserStore()
    const { data: categories = [] } = useCategories()
    const { mutateAsync: create, isPending: creating } = useCreateProduct()
    const { mutateAsync: update, isPending: updating } = useUpdateProduct()
    const isPending = creating || updating

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { name: "", description: "", price: 0, stock: 0, categoryId: undefined, isActive: true },
    })
    const { control, handleSubmit, reset, formState: { errors } } = form

    useEffect(() => {
        if (!editing) return
        reset({
            name: editing.name,
            description: editing.description ?? "",
            price: typeof editing.price === "string" ? parseFloat(editing.price) : editing.price,
            stock: editing.stock,
            categoryId: editing.category?.id ?? editing.categoryId ?? undefined,
            isActive: editing.isActive ?? true,
        })
        const existingImages: string[] = []
        if (editing.imageUrl) existingImages.push(editing.imageUrl)
        if (Array.isArray(editing.images)) {
            editing.images.forEach((img) => {
                const url = typeof img === "string" ? img : img?.url
                if (url && !existingImages.includes(url)) existingImages.push(url)
            })
        }
        setImagePreviews(existingImages)
        setImageFiles([])
        setOpen(true)
    }, [editing, reset])

    const handleClose = (val: boolean) => {
        setOpen(val)
        if (!val) { reset(); setImageFiles([]); setImagePreviews([]); onClose?.() }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? [])
        if (imageFiles.length + selected.length > 5) {
            toast.error("Máximo de 5 imagens por produto.")
            return
        }
        const newFiles = [...imageFiles, ...selected]
        setImageFiles(newFiles)
        setImagePreviews(newFiles.map((f) => URL.createObjectURL(f)))
        e.target.value = ""
    }

    const removeImage = (index: number) => {
        const newFiles = imageFiles.filter((_, i) => i !== index)
        setImageFiles(newFiles)
        setImagePreviews(newFiles.map((f) => URL.createObjectURL(f)))
    }

    const onSubmit = async (data: FormValues): Promise<void> => {
        try {
            if (isEditing && editing) {
                await update({ id: editing.id, data: { ...data, organizationId: orgId!, images: imageFiles.length > 0 ? imageFiles : undefined } })
                toast.success("Produto atualizado")
            } else {
                await create({ ...data, organizationId: orgId!, images: imageFiles.length > 0 ? imageFiles : undefined })
                toast.success("Produto criado")
            }
            handleClose(false)
        } catch {
            toast.error("Erro ao salvar produto")
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            {!isEditing && (
                <Button
                    onClick={() => setOpen(true)}
                    className="bg-gold text-obsidian-nav hover:bg-gold/90 h-10 px-5 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2"
                >
                    <PackagePlus className="h-4 w-4" />
                    Novo Produto
                </Button>
            )}

            <DialogContent className="w-[95vw] sm:max-w-lg mx-auto p-0 overflow-hidden border-border rounded-2xl bg-obsidian-card">
                <div className="p-6 sm:p-8 space-y-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-content-primary uppercase tracking-widest">
                            {isEditing ? "Editar Produto" : "Novo Produto"}
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}><form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-content-muted uppercase tracking-widest ml-1">
                                Imagens do Produto <span className="normal-case font-medium">(máx. 5)</span>
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpg,image/jpeg,image/png,image/webp"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <div className="flex flex-wrap gap-2">
                                {imagePreviews.map((src, i) => (
                                    <div key={i} className="relative size-20 rounded-xl overflow-hidden border border-border bg-obsidian-nav flex-shrink-0">
                                        <img src={src} alt="" className="w-full h-full object-cover" />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => removeImage(i)}
                                            className="absolute top-1 right-1 size-5 p-0 rounded-full bg-black/60 flex items-center justify-center hover:bg-red-500/80 transition-colors"
                                        >
                                            <X className="size-3 text-white" />
                                        </Button>
                                    </div>
                                ))}
                                {imagePreviews.length < 5 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="size-20 rounded-xl border-2 border-dashed border-border bg-obsidian-nav hover:border-gold/40 hover:bg-obsidian-hover flex flex-col items-center justify-center gap-1 transition-colors flex-shrink-0 p-0 h-auto"
                                    >
                                        <ImagePlus className="size-5 text-content-muted" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-content-muted">Foto</span>
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-content-muted uppercase tracking-widest ml-1">Nome</label>
                            <Controller name="name" control={control} render={({ field }) => (
                                <Input {...field} placeholder="Ex: Camisa Oversized" className="h-11 rounded-xl border-border bg-obsidian-nav text-content-primary placeholder:text-content-muted/30" />
                            )} />
                            {errors.name && <p className="text-xs text-red-400 ml-1">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-content-muted uppercase tracking-widest ml-1">Descrição</label>
                            <Controller name="description" control={control} render={({ field }) => (
                                <Input {...field} placeholder="Descrição do produto..." className="h-11 rounded-xl border-border bg-obsidian-nav text-content-primary placeholder:text-content-muted/30" />
                            )} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-content-muted uppercase tracking-widest ml-1">Preço (R$)</label>
                                <Controller name="price" control={control} render={({ field }) => {
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
                                }} />
                                {errors.price && <p className="text-xs text-red-400 ml-1">{errors.price.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-content-muted uppercase tracking-widest ml-1">Estoque</label>
                                <Controller name="stock" control={control} render={({ field }) => (
                                    <Input
                                        inputMode="numeric"
                                        placeholder="0"
                                        className="h-11 rounded-xl border-border bg-obsidian-nav text-content-primary placeholder:text-content-muted/30"
                                        value={field.value === 0 ? "" : String(field.value)}
                                        onChange={(e) => {
                                            const digits = e.target.value.replace(/\D/g, "")
                                            field.onChange(digits === "" ? 0 : parseInt(digits, 10))
                                        }}
                                    />
                                )} />
                                {errors.stock && <p className="text-xs text-red-400 ml-1">{errors.stock.message}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-content-muted uppercase tracking-widest ml-1">Categoria</label>
                                <Controller name="categoryId" control={control} render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="h-11 rounded-xl border-border bg-obsidian-nav text-content-primary w-full">
                                            <SelectValue placeholder="Sem categoria">
                                                {field.value
                                                    ? (categories.find((c) => c.id === field.value)?.name ?? "Sem categoria")
                                                    : "Sem categoria"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className="bg-obsidian-nav border-border rounded-xl">
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-content-muted uppercase tracking-widest ml-1">Status</label>
                                <Controller name="isActive" control={control} render={({ field }) => (
                                    <Select onValueChange={(v) => field.onChange(v === "true")} value={String(field.value ?? true)}>
                                        <SelectTrigger className="h-11 rounded-xl border-border bg-obsidian-nav text-content-primary w-full">
                                            <SelectValue>
                                                {field.value !== false ? "Ativo" : "Inativo"}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent className="bg-obsidian-nav border-border rounded-xl">
                                            <SelectItem value="true">Ativo</SelectItem>
                                            <SelectItem value="false">Inativo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )} />
                            </div>
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
                    </form></Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus, Mail, UserPlus, Copy, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAddMember, useInviteMember, useUpdateMemberRole } from "@/lib/hooks/useTeam"
import { Form } from "@/components/ui/form"
import { TeamMember } from "@/lib/api/team-service"
import { InviteResponse } from "@/lib/api/team-service"

const roleOptions = [
    { value: "STAFF", label: "Colaborador" },
    { value: "ADMIN", label: "Administrador" },
    { value: "OWNER", label: "Proprietário" },
] as const

type Role = "OWNER" | "ADMIN" | "STAFF"

const manualSchema = z.object({
    email: z.string().email("E-mail inválido"),
    role: z.enum(["OWNER", "ADMIN", "STAFF"]),
})

const inviteSchema = z.object({
    email: z.string().email("E-mail inválido"),
    role: z.enum(["OWNER", "ADMIN", "STAFF"]),
})

type ManualFormValues = z.infer<typeof manualSchema>
type InviteFormValues = z.infer<typeof inviteSchema>

interface AddMemberModalProps {
    editTarget?: TeamMember | null
    onClose?: () => void
}

export function AddMemberModal({ editTarget, onClose }: AddMemberModalProps) {
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<"manual" | "invite">("manual")
    const [copied, setCopied] = useState(false)
    const [inviteResult, setInviteResult] = useState<InviteResponse | null>(null)

    const { mutateAsync: addMember, isPending: isAdding } = useAddMember()
    const { mutateAsync: inviteMember, isPending: isInviting } = useInviteMember()
    const { mutateAsync: updateRole, isPending: isUpdating } = useUpdateMemberRole()

    const manualForm = useForm<ManualFormValues>({
        resolver: zodResolver(manualSchema),
        defaultValues: { email: "", role: "STAFF" },
    })

    const inviteForm = useForm<InviteFormValues>({
        resolver: zodResolver(inviteSchema),
        defaultValues: { email: "", role: "STAFF" },
    })

    useEffect(() => {
        if (editTarget) {
            manualForm.reset({ email: editTarget.user.email, role: editTarget.role as Role })
            setOpen(true)
        }
    }, [editTarget, manualForm])

    function handleClose() {
        setOpen(false)
        manualForm.reset({ email: "", role: "STAFF" })
        inviteForm.reset({ email: "", role: "STAFF" })
        setInviteResult(null)
        setActiveTab("manual")
        onClose?.()
    }

    async function onManualSubmit(data: ManualFormValues) {
        if (editTarget) {
            await updateRole({ id: editTarget.id, role: data.role })
        } else {
            await addMember({ email: data.email, role: data.role })
        }
        handleClose()
    }

    async function onInviteSubmit(data: InviteFormValues) {
        const result = await inviteMember({ email: data.email, role: data.role })
        setInviteResult(result)
    }

    function handleCopy() {
        if (!inviteResult) return
        navigator.clipboard.writeText(inviteResult.inviteUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else setOpen(true) }}>
            <DialogTrigger render={
                <Button variant="premium" size="premium" onClick={() => setOpen(true)} />
            }>
                <Plus className="h-5 w-5" />
                Adicionar Membro
            </DialogTrigger>
            <DialogContent className="w-[95vw] sm:max-w-md mx-auto p-0 overflow-hidden border-none shadow-none rounded-2xl bg-obsidian-card">
                <div className="p-6 sm:p-8 pt-12 sm:pt-14 space-y-8 sm:space-y-10">
                    {!inviteResult ? (
                        <>
                            <DialogHeader>
                                <DialogTitle className="text-xl sm:text-2xl font-heading text-content-primary">
                                    {editTarget ? "Editar Cargo" : "Novo Membro"}
                                </DialogTitle>
                                <DialogDescription className="text-content-muted font-medium text-sm sm:text-base">
                                    {editTarget
                                        ? "Altere o cargo deste colaborador."
                                        : "Adicione um novo colaborador ou envie um convite de acesso."}
                                </DialogDescription>
                            </DialogHeader>

                            {!editTarget && (
                                <div className="flex bg-obsidian-nav p-1 rounded-full border border-border">
                                    <Button
                                        variant="ghost"
                                        onClick={() => setActiveTab("manual")}
                                        className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-full text-[11px] sm:text-xs font-bold transition-all shadow-none hover:bg-transparent cursor-pointer ${activeTab === "manual" ? "bg-obsidian-card text-gold" : "text-content-muted hover:text-content-primary"}`}
                                    >
                                        <UserPlus className="h-3.5 w-3.5" />
                                        Manual
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setActiveTab("invite")}
                                        className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-full text-[11px] sm:text-xs font-bold transition-all shadow-none hover:bg-transparent cursor-pointer ${activeTab === "invite" ? "bg-obsidian-card text-gold" : "text-content-muted hover:text-content-primary"}`}
                                    >
                                        <Mail className="h-3.5 w-3.5" />
                                        Convite
                                    </Button>
                                </div>
                            )}

                            {(activeTab === "manual" || editTarget) ? (
                                <Form {...manualForm}><form onSubmit={manualForm.handleSubmit(onManualSubmit)} className="space-y-5">
                                    {!editTarget && (
                                        <div className="space-y-2">
                                            <label className="text-[11px] font-bold text-content-muted uppercase tracking-widest ml-1">E-mail</label>
                                            <Controller
                                                name="email"
                                                control={manualForm.control}
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="joao@arcturo.com" type="email" variant="premium" size="premium" className="w-full" />
                                                )}
                                            />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-content-muted uppercase tracking-widest ml-1">Permissão</label>
                                        <Controller
                                            name="role"
                                            control={manualForm.control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger size="premium" className="w-full">
                                                        <SelectValue placeholder="Selecione a permissão" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-obsidian-nav border-border text-content-primary rounded-xl">
                                                        {roleOptions.map((opt) => (
                                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                    <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4">
                                        <DialogClose render={
                                            <Button type="button" variant="ghost" onClick={handleClose} className="font-bold text-content-muted hover:text-content-primary hover:bg-obsidian-hover w-full sm:w-auto" />
                                        }>
                                            Cancelar
                                        </DialogClose>
                                        <Button type="submit" variant="premium" size="premium" className="w-full sm:w-auto sm:px-10" disabled={isAdding || isUpdating}>
                                            {isAdding || isUpdating ? "Salvando..." : editTarget ? "Salvar Cargo" : "Cadastrar Membro"}
                                        </Button>
                                    </div>
                                </form></Form>
                            ) : (
                                <Form {...inviteForm}><form onSubmit={inviteForm.handleSubmit(onInviteSubmit)} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-content-muted uppercase tracking-widest ml-1">E-mail do Convidado</label>
                                        <Controller
                                            name="email"
                                            control={inviteForm.control}
                                            render={({ field }) => (
                                                <Input {...field} placeholder="email@exemplo.com" type="email" variant="premium" size="premium" className="w-full" />
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-content-muted uppercase tracking-widest ml-1">Cargo / Permissão</label>
                                        <Controller
                                            name="role"
                                            control={inviteForm.control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger size="premium" className="w-full">
                                                        <SelectValue placeholder="Selecione a permissão" />
                                                    </SelectTrigger>
                                                    <SelectContent className="bg-obsidian-nav border-border text-content-primary rounded-xl">
                                                        {roleOptions.map((opt) => (
                                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                    <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-4">
                                        <DialogClose render={
                                            <Button type="button" variant="ghost" onClick={handleClose} className="font-bold text-content-muted hover:text-content-primary hover:bg-obsidian-hover w-full sm:w-auto" />
                                        }>
                                            Cancelar
                                        </DialogClose>
                                        <Button type="submit" variant="premium" size="premium" className="w-full sm:w-auto sm:px-10" disabled={isInviting}>
                                            {isInviting ? "Gerando..." : "Gerar Convite"}
                                        </Button>
                                    </div>
                                </form></Form>
                            )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-8 sm:gap-10 animate-in fade-in zoom-in-95 duration-500">
                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="flex items-center justify-center h-20 w-20 rounded-full bg-emerald-500/10 text-emerald-400">
                                    <Check className="h-10 w-10" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl sm:text-3xl font-heading text-content-primary font-black">
                                        Convite Gerado!
                                    </h2>
                                    <p className="text-content-muted font-medium text-sm sm:text-base max-w-[280px]">
                                        Compartilhe o link abaixo com o colaborador. Expira em 7 dias.
                                    </p>
                                </div>
                            </div>

                            <div className="w-full space-y-3">
                                <div className="flex items-center gap-2 p-1 pl-4 bg-obsidian-nav border border-border rounded-2xl overflow-hidden focus-within:border-gold/50 transition-colors">
                                    <div className="flex-1 text-xs font-bold text-content-primary break-all select-all py-3">
                                        {inviteResult.inviteUrl}
                                    </div>
                                    <Button
                                        onClick={handleCopy}
                                        className={cn(
                                            "h-10 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all",
                                            copied ? "bg-emerald-500 text-white" : "bg-gold text-obsidian-nav hover:bg-gold/90"
                                        )}
                                    >
                                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4 mr-2" />}
                                        {copied ? "" : "Copiar"}
                                    </Button>
                                </div>
                            </div>

                            <div className="w-full pt-4">
                                <DialogClose render={
                                    <Button variant="premium" size="premium" className="w-full h-14 rounded-2xl text-sm font-black uppercase tracking-[0.2em]" onClick={handleClose} />
                                }>
                                    Concluir
                                </DialogClose>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

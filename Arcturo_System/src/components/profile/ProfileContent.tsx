"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    IconBriefcase,
    IconUserCircle,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { FavoritesList } from "@/components/FavoritesList";
import { OrdersList } from "@/components/OrderList";
import { useUserStore } from "@/lib/store/useUserStore";
import { updateProfileAPI, UpdateProfileDto } from "@/lib/api/auth-service";

const editSchema = z.object({
    name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    phone: z.string().nullable().optional(),
    bio: z.string().nullable().optional(),
});

type EditFormData = z.infer<typeof editSchema>;

interface UserInfoProps {
    label: string;
    value: string;
}

function UserInfo({ label, value }: UserInfoProps) {
    return (
        <div className="px-6 py-5 hover:bg-obsidian-hover transition-colors">
            <div className="mb-1 font-bold text-content-muted text-xs uppercase tracking-wider">
                {label}
            </div>
            <div className="font-black text-content-primary text-[15px]">
                {value}
            </div>
        </div>
    );
}

export function ProfileContent() {
    const { user, updateUser } = useUserStore();
    const queryClient = useQueryClient();
    const [editOpen, setEditOpen] = useState(false);

    const form = useForm<EditFormData>({
        resolver: zodResolver(editSchema),
        values: {
            name: user?.name ?? "",
            phone: user?.phone ?? null,
            bio: user?.bio ?? null,
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: UpdateProfileDto) => updateProfileAPI(data),
        onSuccess: (updated) => {
            updateUser({ ...user!, ...updated });
            queryClient.setQueryData(["user-profile"], updated);
            toast.success("Perfil atualizado com sucesso");
            setEditOpen(false);
        },
        onError: () => {
            toast.error("Erro ao atualizar perfil");
        },
    });

    const onSubmit = (data: EditFormData) => {
        const phone = data.phone ? "+" + data.phone.replace(/\D/g, "") : data.phone;
        updateMutation.mutate({ ...data, phone });
    };

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).getFullYear().toString()
        : "—";

    const orgName = user?.memberships?.[0]?.organization?.name ?? null;

    return (
        <div className="min-h-dvh bg-obsidian-page">
            <div className="relative mx-auto flex w-full max-w-5xl flex-col px-4 py-10 md:px-6 md:py-16">
                <div className="mb-4 flex flex-col md:flex-row md:items-center gap-6 bg-obsidian-card p-6 md:p-8 rounded-3xl shadow-none border border-border">
                    <div className="flex items-center gap-4">
                        <Avatar className="size-24 border-4 border-obsidian-card shadow-none max-[24rem]:size-20 sm:size-32">
                            <AvatarImage
                                alt="Avatar"
                                src={user?.avatar ?? ""}
                                className="object-cover"
                            />
                            <AvatarFallback className="font-black text-4xl bg-gold text-obsidian-nav border-2 border-gold/20">
                                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex flex-col gap-1 sm:gap-2">
                        <div className="text-xl font-black tracking-tight text-content-primary sm:text-4xl font-heading break-words leading-tight max-w-xl">
                            {user?.name ?? "Carregando..."}
                        </div>
                        <div className="text-content-muted font-medium sm:text-lg">
                            {user?.email ?? "..."}
                        </div>
                        {orgName && (
                            <div className="text-[11px] font-black uppercase tracking-widest text-gold mt-1">
                                {orgName}
                            </div>
                        )}
                    </div>
                </div>

                {user?.bio && (
                    <div className="mt-2 text-content-muted font-medium leading-relaxed px-2 italic">
                        {user.bio}
                    </div>
                )}

                <div className="mt-8 flex w-full items-center gap-3 px-2">
                    <Button
                        onClick={() => setEditOpen(true)}
                        className="font-bold bg-gold text-obsidian-nav hover:bg-gold/90 rounded-full px-8 h-12 shadow-none"
                    >
                        Editar Perfil
                    </Button>
                </div>
            </div>

            <Tabs className="w-full" defaultValue="profile">
                <div className="mt-8 relative z-10 w-full bg-obsidian-page pt-2 border-b border-border">
                    <TabsList
                        className={cn(
                            "mx-auto w-full max-w-5xl px-4 md:px-6 relative top-[1px] rounded-none bg-transparent p-0 flex justify-start gap-2 h-auto overflow-x-auto scrollbar-hide snap-x",
                            "*:rounded-t-lg *:rounded-b-none *:border-0 *:border-b-2 *:border-transparent *:bg-transparent *:px-4 md:*:px-6 *:py-3.5 *:font-bold *:text-content-muted *:uppercase *:tracking-wider *:text-[10px] md:*:text-xs hover:*:text-content-primary transition-all *:whitespace-nowrap *:flex-shrink-0 snap-start",
                            "*:data-active:border-gold *:data-active:!bg-gold/10 dark:*:data-active:!bg-obsidian-card",
                            "*:data-active:!text-gold"
                        )}
                    >
                        <TabsTrigger value="profile">Visão Geral</TabsTrigger>
                        <TabsTrigger value="orders">Meus Pedidos</TabsTrigger>
                        <TabsTrigger value="favorites">Favoritos</TabsTrigger>
                    </TabsList>
                </div>

                <div className="mx-auto w-full max-w-5xl px-4 md:px-6 py-12">
                    <TabsContent value="profile" className="m-0 space-y-8">
                        <div className="bg-obsidian-card rounded-3xl border border-border shadow-none overflow-hidden">
                            <div className="flex items-center gap-3 bg-obsidian-nav px-6 py-5 border-b border-border font-black text-xl text-content-primary">
                                <IconUserCircle className="size-6 text-gold" />
                                Informações Pessoais
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                                <UserInfo label="Nome Completo" value={user?.name ?? "—"} />
                                <UserInfo label="E-mail" value={user?.email ?? "—"} />
                                <UserInfo label="Telefone" value={user?.phone ?? "—"} />
                                <UserInfo label="Membro Desde" value={memberSince} />
                            </div>
                        </div>

                        {orgName && (
                            <div className="bg-obsidian-card rounded-3xl border border-border shadow-none overflow-hidden">
                                <div className="flex items-center gap-3 bg-obsidian-nav px-6 py-5 border-b border-border font-black text-xl text-content-primary">
                                    <IconBriefcase className="size-6 text-gold" />
                                    Loja
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
                                    <UserInfo label="Organização" value={orgName} />
                                    <UserInfo label="Função" value={user?.memberships?.[0]?.role ?? "—"} />
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="orders" className="m-0">
                        <OrdersList />
                    </TabsContent>

                    <TabsContent value="favorites" className="m-0">
                        <FavoritesList />
                    </TabsContent>
                </div>
            </Tabs>

            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                <DialogContent className="bg-obsidian-card border-border text-content-primary max-w-md">
                    <DialogHeader>
                        <DialogTitle className="font-black uppercase tracking-widest text-sm text-gold">
                            Editar Perfil
                        </DialogTitle>
                    </DialogHeader>

                    <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 mt-2">
                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-bold uppercase tracking-widest text-content-muted">
                                Nome completo
                            </Label>
                            <Input
                                {...form.register("name")}
                                className="bg-obsidian-nav border-border text-content-primary h-11"
                            />
                            {form.formState.errors.name && (
                                <p className="text-xs text-red-400">{form.formState.errors.name.message}</p>
                            )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-bold uppercase tracking-widest text-content-muted">
                                Telefone
                            </Label>
                            <Input
                                {...form.register("phone")}
                                placeholder="+55 (11) 99999-9999"
                                className="bg-obsidian-nav border-border text-content-primary h-11 placeholder:text-content-muted/40"
                                onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, "").slice(0, 13)
                                    let masked = ""
                                    if (digits.length > 0) masked = "+" + digits.slice(0, 2)
                                    if (digits.length > 2) masked += " (" + digits.slice(2, 4)
                                    if (digits.length > 4) masked += ") " + digits.slice(4, 9)
                                    if (digits.length > 9) masked += "-" + digits.slice(9, 13)
                                    form.setValue("phone", masked)
                                }}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label className="text-xs font-bold uppercase tracking-widest text-content-muted">
                                Bio
                            </Label>
                            <Textarea
                                {...form.register("bio")}
                                rows={3}
                                placeholder="Fale um pouco sobre você..."
                                className="bg-obsidian-nav border-border text-content-primary rounded-md text-sm resize-none focus:ring-gold placeholder:text-content-muted/40"
                            />
                        </div>

                        <DialogFooter className="mt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setEditOpen(false)}
                                className="text-content-muted hover:text-content-primary"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="bg-gold text-obsidian-nav hover:bg-gold/90 font-bold rounded-full px-6"
                            >
                                {updateMutation.isPending ? "Salvando..." : "Salvar"}
                            </Button>
                        </DialogFooter>
                    </form></Form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

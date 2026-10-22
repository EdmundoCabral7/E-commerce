"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { loginAPI, getProfileAPI } from "@/lib/api/auth-service";
import { loginSchema, LoginFormData } from "@/lib/schemas/loginSchema";
import { useUserStore } from "@/lib/store/useUserStore";
import { useState, useEffect } from "react";

export function AdminLoginForm() {
    const router = useRouter();
    const { setAuth, isAuthenticated, user } = useUserStore();
    const [accessError, setAccessError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    useEffect(() => {
        if (isAuthenticated && (user?.role === "ADMIN" || (user?.memberships?.length ?? 0) > 0)) {
            router.replace("/dashboard");
        }
    }, [isAuthenticated, user, router]);

    const onSubmit = async (data: LoginFormData) => {
        setAccessError(null);
        setLoading(true);
        try {
            const authData = await loginAPI(data);
            const profile = await getProfileAPI(authData.token);

            const isAdmin = profile.role === "ADMIN" || (profile.memberships?.length ?? 0) > 0;
            if (!isAdmin) {
                setAccessError("Acesso negado. Esta área é exclusiva para administradores.");
                setLoading(false);
                return;
            }

            setAuth(profile, authData.token);
            router.replace("/dashboard");
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } })?.response?.status;
            const msg = status === 401
                ? "E-mail ou senha incorretos."
                : status
                ? `Erro ${status} ao autenticar. Tente novamente.`
                : "Não foi possível conectar ao servidor.";
            form.setError("root", { message: msg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-dvh bg-obsidian-page flex items-center justify-center px-6">
            <div className="w-full max-w-sm">
                <Card className="w-full shadow-none bg-obsidian-card border-border overflow-hidden">
                    <div className="flex flex-col items-center gap-2 pt-24 pb-8">
                        <div className="font-heading text-xl tracking-widest uppercase select-none">
                            <span className="text-gold">Arcturo</span>
                            <span className="text-content-primary">Shop</span>
                        </div>
                        <div className="text-[11px] font-black uppercase tracking-[0.25em] text-content-muted">
                            Painel Administrativo
                        </div>
                    </div>

                    <CardContent className="flex flex-col gap-5 pb-24 mt-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col gap-2.5">
                                            <FormLabel className="ml-2 text-xs font-black uppercase tracking-widest text-content-muted">Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="seu@email.com"
                                                    className="h-12 rounded-xl border-border bg-obsidian-nav text-content-primary placeholder:text-content-muted/30"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col gap-2.5">
                                            <FormLabel className="ml-2 text-xs font-black uppercase tracking-widest text-content-muted">Senha</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="********"
                                                    className="h-12 rounded-xl border-border bg-obsidian-nav text-content-primary placeholder:text-content-muted/30"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {form.formState.errors.root && (
                                    <p className="text-sm text-red-400 text-center">{form.formState.errors.root.message}</p>
                                )}

                                {accessError && (
                                    <p className="text-sm text-red-400 text-center">{accessError}</p>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-4 w-full bg-gold text-obsidian-nav hover:bg-gold/90 h-12 rounded-xl"
                                >
                                    <div className="font-black uppercase tracking-widest text-[10px]">
                                        {loading ? "Autenticando..." : "Entrar"}
                                    </div>
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>

    );
}

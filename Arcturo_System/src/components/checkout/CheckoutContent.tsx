"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ShoppingBag, CreditCard, QrCode, FileText, CheckCircle } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { createCheckout } from "@/lib/api/sales-service";
import { useUserStore } from "@/lib/store/useUserStore";
import { Form } from "@/components/ui/form";

const checkoutSchema = z.object({
    buyerName: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
    buyerEmail: z.string().email("E-mail inválido"),
    paymentMethod: z.enum(["credit_card", "pix", "boleto"], {
        error: "Selecione um método de pagamento",
    }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const PAYMENT_OPTIONS = [
    { value: "credit_card", label: "Cartão de Crédito", icon: CreditCard },
    { value: "pix", label: "Pix", icon: QrCode },
    { value: "boleto", label: "Boleto", icon: FileText },
] as const;

export default function CheckoutContent() {
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCart();
    const { user } = useUserStore();
    const [orderId, setOrderId] = useState<string | null>(null);

    const form = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            buyerName: user?.name ?? "",
            buyerEmail: user?.email ?? "",
        },
    });
    const { register, handleSubmit, watch, setValue, formState: { errors } } = form;

    const selectedPayment = watch("paymentMethod");

    const orgId = items[0]?.organizationId ?? "";

    const checkoutMutation = useMutation({
        mutationFn: (data: CheckoutFormData) =>
            createCheckout({
                ...data,
                orgId,
                items: items.map((item) => ({
                    productId: item.id,
                    quantity: item.quantity,
                })),
            }),
        onSuccess: (order) => {
            setOrderId(order.id);
            clearCart();
        },
    });

    const onSubmit = (data: CheckoutFormData) => {
        checkoutMutation.mutate(data);
    };

    if (orderId) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
                <div className="size-20 rounded-full bg-gold/10 flex items-center justify-center">
                    <CheckCircle className="size-10 text-gold" />
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-black text-content-primary uppercase tracking-widest">
                        Pedido Confirmado!
                    </h2>
                    <p className="text-content-muted text-sm">
                        Seu pedido <span className="text-gold font-bold">#{orderId.slice(0, 8).toUpperCase()}</span> foi recebido com sucesso.
                    </p>
                </div>
                <div className="flex gap-4 mt-4">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/orders")}
                        className="border border-border text-content-primary hover:text-gold hover:bg-obsidian-hover rounded-full px-6"
                    >
                        Ver Meus Pedidos
                    </Button>
                    <Button
                        onClick={() => router.push("/")}
                        className="bg-gold text-obsidian-nav font-bold rounded-full px-6 hover:bg-gold/90"
                    >
                        Continuar Comprando
                    </Button>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        router.replace("/cart");
        return null;
    }

    const total = totalPrice;

    return (
        <div className="w-full max-w-5xl mx-auto">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-8 h-auto p-0 flex items-center gap-2 text-content-primary hover:text-gold transition-colors bg-transparent hover:bg-transparent shadow-none text-[12px] font-black uppercase tracking-widest"
            >
                <ChevronLeft className="size-4" />
                Voltar ao Carrinho
            </Button>

            <Form {...form}><form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        <Card className="bg-obsidian-card border border-border shadow-none rounded-lg p-6 flex flex-col gap-6">
                            <div className="text-[11px] font-black uppercase tracking-widest text-gold">
                                Dados do Comprador
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-content-muted">
                                        Nome completo
                                    </Label>
                                    <Input
                                        {...register("buyerName")}
                                        placeholder="Seu nome completo"
                                        className="bg-obsidian-nav border-border text-content-primary placeholder:text-content-muted/50 focus:ring-gold h-11"
                                    />
                                    {errors.buyerName && (
                                        <p className="text-xs text-red-400">{errors.buyerName.message}</p>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-content-muted">
                                        E-mail
                                    </Label>
                                    <Input
                                        {...register("buyerEmail")}
                                        type="email"
                                        placeholder="seu@email.com"
                                        className="bg-obsidian-nav border-border text-content-primary placeholder:text-content-muted/50 focus:ring-gold h-11"
                                    />
                                    {errors.buyerEmail && (
                                        <p className="text-xs text-red-400">{errors.buyerEmail.message}</p>
                                    )}
                                </div>
                            </div>
                        </Card>

                        <Card className="bg-obsidian-card border border-border shadow-none rounded-lg p-6 flex flex-col gap-6">
                            <div className="text-[11px] font-black uppercase tracking-widest text-gold">
                                Método de Pagamento
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {PAYMENT_OPTIONS.map(({ value, label, icon: Icon }) => (
                                    <Button
                                        key={value}
                                        type="button"
                                        variant="outline"
                                        onClick={() => setValue("paymentMethod", value, { shouldValidate: true })}
                                        className={`flex flex-col items-center gap-3 p-4 rounded-xl border-2 h-auto transition-all ${
                                            selectedPayment === value
                                                ? "border-gold bg-gold/5 text-gold"
                                                : "border-border bg-obsidian-nav text-content-muted hover:border-gold/30 hover:text-content-primary"
                                        }`}
                                    >
                                        <Icon className="size-6" />
                                        <span className="text-[11px] font-black uppercase tracking-widest">{label}</span>
                                    </Button>
                                ))}
                            </div>

                            {errors.paymentMethod && (
                                <p className="text-xs text-red-400">{errors.paymentMethod.message}</p>
                            )}
                        </Card>
                    </div>

                    <div className="lg:col-span-5">
                        <Card className="bg-obsidian-card border border-border shadow-none rounded-lg p-6 flex flex-col gap-6">
                            <div className="text-[11px] font-black uppercase tracking-widest text-gold flex items-center gap-2">
                                <ShoppingBag className="size-4" />
                                Resumo do Pedido
                            </div>

                            <div className="flex flex-col gap-3 max-h-64 overflow-y-auto pr-1">
                                {items.map((item) => {
                                    const price = typeof item.price === "string" ? parseFloat(item.price) : item.price;
                                    const imageUrl = item.images?.[0]?.url ?? item.imageUrl ?? undefined;
                                    return (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <div className="size-12 rounded-lg bg-white border border-border overflow-hidden shrink-0">
                                                {imageUrl && (
                                                    <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-content-primary truncate">{item.name}</p>
                                                <p className="text-[11px] text-content-muted">Qtd: {item.quantity}</p>
                                            </div>
                                            <div className="text-sm font-bold text-content-primary shrink-0">
                                                R$ {(price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <Separator className="bg-border" />

                            <div className="flex flex-col gap-2 text-sm">
                                <div className="flex justify-between text-content-muted">
                                    <span>Subtotal</span>
                                    <span>R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="flex justify-between text-content-muted">
                                    <span>Frete Arcturo</span>
                                    <span className="text-gold font-semibold italic">Grátis</span>
                                </div>
                            </div>

                            <Separator className="bg-border" />

                            <div className="flex justify-between items-baseline">
                                <span className="text-base font-bold text-content-primary">Total</span>
                                <div className="flex items-baseline gap-1 text-gold font-bold text-xl">
                                    <span className="text-sm font-normal">R$</span>
                                    {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </div>
                            </div>

                            {checkoutMutation.isError && (
                                <p className="text-xs text-red-400 text-center">
                                    Erro ao finalizar pedido. Verifique os dados e tente novamente.
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={checkoutMutation.isPending || items.length === 0}
                                className="w-full bg-gold hover:bg-gold/90 text-obsidian-nav font-black h-12 rounded-full shadow-none tracking-wide uppercase disabled:opacity-50 transition-all active:scale-[0.98]"
                            >
                                {checkoutMutation.isPending ? "Processando..." : "Finalizar Pedido"}
                            </Button>

                            <p className="text-[11px] text-content-muted text-center leading-tight">
                                Ao finalizar, você confirma a compra e aceita os termos de uso.
                            </p>
                        </Card>
                    </div>
                </div>
            </form></Form>
        </div>
    );
}

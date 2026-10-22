"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/lib/hooks/useAuth";
import { registerSchema, RegisterFormData } from "@/lib/schemas/registerSchema";
import { toast } from "sonner";
import { AuthHeader } from "@/components/auth/AuthHeader";

export function RegisterForm() {
  const router = useRouter();
  const { register, isRegistering } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register(data);
      toast.success("Conta criada com sucesso!");
      router.push("/");
    } catch (error) {
      toast.error("Erro ao criar conta. Verifique os dados.");
    }
  };

  return (
    <div className="min-h-dvh bg-obsidian-page">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 md:py-16 flex flex-col items-center justify-center">
        <Card className="w-full max-w-sm shadow-none bg-obsidian-card border-border overflow-hidden">
          <AuthHeader />

          <CardContent className="flex flex-col gap-5 pb-8 mt-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-col gap-2.5">
                      <FormLabel className="ml-2 text-xs font-black uppercase tracking-widest text-content-muted">Nome Completo</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Seu nome"
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

                <Button
                  type="submit"
                  disabled={isRegistering}
                  className="mt-4 w-full bg-gold text-obsidian-nav hover:bg-gold/90 h-12 rounded-xl"
                >
                  <div className="font-black uppercase tracking-widest text-[10px]">
                    {isRegistering ? "Cadastrando..." : "Cadastrar"}
                  </div>
                </Button>
              </form>
            </Form>

            <div className="relative mt-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <div className="bg-obsidian-card px-2 text-content-muted font-bold tracking-widest">Ou</div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 mt-2">
              <Button variant="outline" type="button" className="w-full rounded-xl border-border bg-obsidian-nav text-content-primary hover:bg-obsidian-hover h-10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 size-4">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" fill="currentColor" />
                </svg>
                <div className="font-bold text-xs">Apple</div>
              </Button>
              <Button variant="outline" type="button" className="w-full rounded-xl border-border bg-obsidian-nav text-content-primary hover:bg-obsidian-hover h-10">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="mr-2 size-4">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="currentColor" />
                </svg>
                <div className="font-bold text-xs">Google</div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

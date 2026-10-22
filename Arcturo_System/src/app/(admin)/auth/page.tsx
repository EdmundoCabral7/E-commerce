import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminAuthPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full p-4 pt-24">
            <Card className="w-full max-w-sm min-h-[620px] flex flex-col justify-center shadow-none border-none">
                <CardHeader className="text-center pb-6">
                    <CardTitle className="text-3xl font-bold text-slate-900">Fazer Login</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 pb-10">
                    <div className="flex flex-col gap-2.5">
                        <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Email</Label>
                        <Input id="email" type="email" placeholder="seu@email.com" className="h-12 rounded-xl border-slate-200 bg-slate-50" />
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Senha</Label>
                            <Link href="#" className="text-xs font-bold text-blue-600 hover:underline underline-offset-4 mr-2">
                                Esqueceu sua senha?
                            </Link>
                        </div>
                        <Input id="password" type="password" placeholder="********" className="h-12 rounded-xl border-slate-200 bg-slate-50" />
                    </div>

                    <Button className="mt-4 w-full bg-black text-white hover:bg-slate-900 font-black uppercase tracking-widest text-[10px] h-12 rounded-xl">
                        Entrar
                    </Button>

                    <div className="text-center text-[11px] text-slate-500 font-medium mt-6 px-6 leading-relaxed">
                        Ao continuar, você concorda com nossos{" "}
                        <Link href="/termos" className="font-bold text-slate-900 border-b border-slate-200 hover:border-slate-900 transition-colors">
                            Termos de Serviço
                        </Link>{" "}
                        e{" "}
                        <Link href="/privacidade" className="font-bold text-slate-900 border-b border-slate-200 hover:border-slate-900 transition-colors">
                            Política de Privacidade
                        </Link>.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

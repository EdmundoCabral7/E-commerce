import { SalesHeader } from "@/components/sales/SalesHeader"
import { SalesList } from "@/components/sales/SalesList"
import { SalesKanban } from "@/components/sales/SalesKanban"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SalesPage() {
    return (
        <div className="flex flex-col gap-8 w-full">
            <SalesHeader />

            <Tabs defaultValue="lista" className="w-full">
                <TabsList className="mb-6 bg-obsidian-card border border-border rounded-full p-1 h-12">
                    <TabsTrigger value="lista" className="h-full px-6 rounded-full text-sm font-bold text-content-muted data-[state=active]:text-obsidian-nav data-[state=active]:bg-gold data-[state=active]:shadow-none data-[state=active]:shadow-gold/20 transition-all">
                        Lista de Vendas
                    </TabsTrigger>
                    <TabsTrigger value="quadro" className="h-full px-6 rounded-full text-sm font-bold text-content-muted data-[state=active]:text-obsidian-nav data-[state=active]:bg-gold data-[state=active]:shadow-none data-[state=active]:shadow-gold/20 transition-all">
                        Quadro de Entregas
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="lista" className="mt-0 outline-none">
                    <SalesList />
                </TabsContent>

                <TabsContent value="quadro" className="mt-0 outline-none">
                    <SalesKanban />
                </TabsContent>
            </Tabs>
        </div>
    )
}

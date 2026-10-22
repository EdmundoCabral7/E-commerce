import { Button } from "@/components/ui/button"
import { Upload, Download } from "lucide-react"
import { ProductFormModal } from "./ProductFormModal"

export function InventoryHeader() {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex flex-col gap-1">
                <div className="text-2xl font-black tracking-tight text-content-primary sm:text-4xl font-heading break-words leading-tight">Estoque</div>
                <div className="text-sm text-content-muted font-medium">Gerencie seus produtos, preços e disponibilidade em tempo real.</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" className="gap-2 bg-white rounded-full">
                    <Upload className="h-4 w-4" />
                    Importar
                </Button>
                <Button variant="outline" className="gap-2 bg-white rounded-full">
                    <Download className="h-4 w-4" />
                    Exportar
                </Button>
                <ProductFormModal />
            </div>
        </div>
    )
}
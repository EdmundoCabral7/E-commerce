import { CategoryFormModal } from "./CategoryFormModal"

export function CategoriesHeader() {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
                <div className="text-3xl font-bold text-content-primary tracking-tight">
                    Categorias
                </div>
                <div className="text-content-muted font-medium">
                    Gerencie a estrutura de departamentos e categorias da sua loja.
                </div>
            </div>
            <div className="flex-shrink-0">
                <CategoryFormModal />
            </div>
        </div>
    )
}

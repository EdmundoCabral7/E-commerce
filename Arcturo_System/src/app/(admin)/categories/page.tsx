import { CategoriesHeader } from "@/components/categories/CategoriesHeader"
import { CategoriesList } from "@/components/categories/CategoriesList"

export default function CategoriesPage() {
    return (
        <div className="flex flex-col gap-8 w-full">
            <CategoriesHeader />
            <CategoriesList />
        </div>
    )
}

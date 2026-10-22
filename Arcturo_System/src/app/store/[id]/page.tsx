import { use } from "react"
import { StoreContent } from "@/components/store/StoreContent"

export default function StorePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <StoreContent id={id} />
}

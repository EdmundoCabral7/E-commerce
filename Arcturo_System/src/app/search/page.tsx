import { Suspense } from "react";
import SearchPageContent from "@/components/search/SearchPageContent";

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-slate-400">Carregando...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}

import CheckoutContent from "@/components/checkout/CheckoutContent";

export const metadata = { title: "Checkout — ArcturoShop" };

export default function CheckoutPage() {
    return (
        <main className="min-h-screen bg-obsidian-page py-12 px-4 md:px-8">
            <div className="max-w-5xl mx-auto mb-10">
                <h1 className="text-[11px] font-black uppercase tracking-[0.3em] text-gold mb-1">
                    ArcturoShop
                </h1>
                <h2 className="text-2xl font-black text-content-primary uppercase tracking-widest">
                    Finalizar Compra
                </h2>
            </div>
            <CheckoutContent />
        </main>
    );
}

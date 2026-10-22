import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { footerSections } from "@/lib/utils/navigation";

export const Footer = () => {
  return (
    <div className="border-t border-border bg-obsidian-nav w-full">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-x-8 gap-y-8 px-6 py-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 xl:px-0">
          <div className="col-span-full xl:col-span-2">
            <div className="text-2xl font-bold tracking-tight text-gold">Arcturoshop</div>
            <div className="mt-4 text-content-muted w-3/4 text-sm font-medium">
              A melhor e mais premium experiência de compras digitais para todo o Brasil.
            </div>
          </div>

          {footerSections.map(({ title, links }) => (
            <div key={title}>
              <div className="font-bold text-gold text-sm">{title}</div>
              <div className="mt-4 flex flex-col space-y-4">
                {links.map(({ title, href }) => (
                  <div key={title}>
                    <Link
                      className="text-content-muted hover:text-content-primary transition-colors text-sm font-medium"
                      href={href}
                    >
                      {title}
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

        <div className="h-px w-full bg-border" />

      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col-reverse items-center justify-between gap-x-2 gap-y-4 px-6 py-4 sm:flex-row xl:px-0">
          <div className="text-content-muted text-[11px] font-medium">
            &copy; {new Date().getFullYear()} Arcturoshop Inc. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-5 text-content-muted">
            <Link href="#" className="hover:text-gold transition-colors">
              <div className="sr-only">Instagram</div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
            </Link>
            <Link href="#" className="hover:text-gold transition-colors">
              <div className="sr-only">Facebook</div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
            </Link>
            <Link href="#" className="hover:text-gold transition-colors">
              <div className="sr-only">X</div>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z" /></svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
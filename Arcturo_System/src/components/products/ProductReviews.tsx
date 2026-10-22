"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, ThumbsUp, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import ReviewForm from "./ReviewForm";
import { useProductReviews } from "@/lib/hooks/useProductInteractions";

interface ProductReviewsProps {
  productId: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { data: reviews = [], isLoading } = useProductReviews(productId);

  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    return { stars: star, count, percentage: totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0 };
  });

  return (
    <div className="flex flex-col gap-12 py-12 border-t border-border">
      <div className="flex flex-col gap-2">
        <div className="text-3xl font-black text-content-primary tracking-tight">Opiniões do Produto</div>
        {totalReviews > 0 ? (
          <div className="flex items-center gap-2">
            <div className="text-5xl font-black text-gold">{averageRating.toFixed(1)}</div>
            <div className="flex flex-col">
              <div className="flex text-gold">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={cn("size-5 fill-current", s > Math.round(averageRating) && "opacity-30")} />
                ))}
              </div>
              <div className="text-[10px] font-black text-content-muted uppercase tracking-widest">{totalReviews} avaliações</div>
            </div>
          </div>
        ) : (
          !isLoading && <div className="text-content-muted font-medium text-sm">Seja o primeiro a avaliar este produto.</div>
        )}
      </div>

      {totalReviews > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              {ratingCounts.map((r) => (
                <div key={r.stars} className="flex items-center gap-4">
                  <div className="w-4 text-xs font-black text-content-muted">{r.stars}</div>
                  <Progress value={r.percentage} className="flex-1" />
                  <div className="w-10 text-[10px] font-black text-content-muted text-right uppercase">{r.count}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-gold/5 border border-gold/10 flex items-center gap-3">
              <div className="bg-gold rounded-full p-2">
                <Star className="size-4 text-obsidian-nav fill-current" />
              </div>
              <div className="text-[11px] font-medium text-content-primary leading-tight">
                {averageRating >= 4
                  ? "A maioria dos compradores recomenda este produto."
                  : "Avaliação baseada nas opiniões dos compradores."}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="flex flex-col gap-8">
              <div className="font-black text-content-muted uppercase tracking-widest text-[10px]">Opiniões em destaque</div>
              <div className="flex flex-col gap-8">
                {isLoading ? (
                  <div className="text-content-muted text-sm">Carregando...</div>
                ) : (
                  reviews.slice(0, 5).map((review) => (
                    <div key={review.id} className="flex flex-col gap-4 pb-8 border-b border-border last:border-0">
                      <div className="flex items-center justify-between">
                        <div className="flex text-gold scale-75 origin-left">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={cn("size-5 fill-current", s > review.rating && "opacity-20")} />
                          ))}
                        </div>
                        <div className="text-[10px] font-black text-content-muted uppercase">{formatDate(review.createdAt)}</div>
                      </div>
                      {review.comment && (
                        <div className="text-content-primary font-medium leading-relaxed italic">
                          "{review.comment}"
                        </div>
                      )}
                      <div className="flex items-center gap-4">
                        <div className="text-[10px] font-black text-content-muted uppercase">{review.user.name ?? "Comprador verificado"}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {reviews.length > 5 && (
                <Button variant="outline" className="w-full h-14 border border-border rounded-full font-black text-[12px] md:text-sm uppercase tracking-wide md:tracking-widest text-content-primary hover:bg-obsidian-hover transition-colors px-4">
                  Mostrar todos os comentários
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <ReviewForm productId={productId} />
    </div>
  );
};

export default ProductReviews;

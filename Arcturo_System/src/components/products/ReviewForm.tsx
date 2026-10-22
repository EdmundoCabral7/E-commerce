"use client";

import { Star, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCreateReview } from "@/lib/hooks/useProductInteractions";

interface ReviewFormProps {
  productId: string;
}

const ReviewForm = ({ productId }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutateAsync, isPending } = useCreateReview(productId);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Por favor, selecione uma nota.");
      return;
    }

    await mutateAsync({ rating, comment: comment || undefined });
    setRating(0);
    setComment("");
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8 rounded-2xl md:rounded-3xl bg-obsidian-card border border-border shadow-none mt-16 md:mt-12">
      <div className="flex flex-col gap-2">
        <div className="text-2xl font-black text-content-primary tracking-tight">O que achou do produto?</div>
        <div className="text-content-muted font-medium text-sm">Sua opinião ajuda outros compradores a decidirem melhor.</div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <div className="text-[10px] font-black uppercase tracking-widest text-content-muted">Sua Avaliação</div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Button
                key={star}
                variant="ghost"
                size="icon"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="transition-transform active:scale-90 cursor-pointer h-auto w-auto p-0 hover:bg-transparent"
              >
                <Star
                  className={cn(
                    "size-8 transition-colors",
                    (hoverRating || rating) >= star
                      ? "fill-gold text-gold"
                      : "text-content-muted/20 fill-transparent"
                  )}
                />
              </Button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="text-[10px] font-black uppercase tracking-widest text-content-muted">Seu Comentário</div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Conte detalhes sobre a qualidade, tamanho e sua satisfação..."
            className="w-full h-32 p-4 rounded-2xl border-2 border-border focus:border-gold outline-none transition-all font-medium text-sm resize-none bg-obsidian-nav text-content-primary placeholder:text-content-muted/30"
          />
        </div>

        <div className="pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[11px] font-medium text-content-muted text-center md:text-left order-2 md:order-1">
            {isSuccess ? (
              <div className="text-green-500 font-black uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start">
                Avaliação enviada com sucesso!
              </div>
            ) : (
              "Sua avaliação será analisada antes de ser publicada."
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isPending || isSuccess}
            className="w-full md:w-auto h-14 md:h-12 px-8 bg-gold hover:bg-gold/90 text-obsidian-nav font-black text-sm uppercase tracking-wide md:tracking-widest rounded-full transition-all flex gap-3 shadow-none active:scale-95 disabled:opacity-50 order-1 md:order-2"
          >
            {isPending ? (
              <div className="size-4 animate-spin rounded-full border-2 border-obsidian-nav/20 border-t-obsidian-nav"></div>
            ) : (
              <Send className="size-4" />
            )}
            Enviar Avaliação
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;

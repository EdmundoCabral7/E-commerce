"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, Sparkles, MessageSquareReply } from "lucide-react";
import { useState } from "react";
import { useProductQuestions, useCreateQuestion, useAnswerQuestion } from "@/lib/hooks/useProductInteractions";
import { useUserStore } from "@/lib/store/useUserStore";

interface ProductQuestionsProps {
  productId: string;
}

function formatRelativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Hoje";
  if (days === 1) return "Ontem";
  return `Há ${days} dias`;
}

const ProductQuestions = ({ productId }: ProductQuestionsProps) => {
  const [question, setQuestion] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const { data: questions = [], isLoading } = useProductQuestions(productId);
  const { mutateAsync: createQuestion, isPending: isCreating } = useCreateQuestion(productId);
  const { mutateAsync: answerQuestion, isPending: isAnswering } = useAnswerQuestion(productId);

  const user = useUserStore((s) => s.user);
  const isAdmin = user?.memberships?.some(
    (m) => m.role === "OWNER" || m.role === "ADMIN"
  );

  const handleSubmit = async () => {
    if (!question.trim()) return;
    await createQuestion({ content: question.trim() });
    setQuestion("");
  };

  const handleAnswer = async (questionId: string) => {
    if (!replyText.trim()) return;
    await answerQuestion({ questionId, answer: replyText.trim() });
    setReplyingTo(null);
    setReplyText("");
  };

  return (
    <div className="flex flex-col gap-10 py-12 border-t border-border">
      <div className="flex flex-col gap-2">
        <div className="text-3xl font-black text-content-primary tracking-tight">Perguntas</div>
        <div className="text-content-muted font-medium">Tire suas dúvidas diretamente com nossa equipe e outros compradores.</div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Digite sua pergunta..."
              className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-border bg-obsidian-nav focus:border-gold text-content-primary outline-none transition-all font-medium placeholder:text-content-muted/30"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-content-muted" />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isCreating || !question.trim()}
            className="h-14 px-8 bg-gold text-obsidian-nav hover:bg-gold/90 font-black text-sm uppercase tracking-widest rounded-full transition-transform active:scale-95 flex gap-2 disabled:opacity-50"
          >
            <Sparkles className="size-4" />
            {isCreating ? "Enviando..." : "Perguntar"}
          </Button>
        </div>

        <div className="flex flex-col gap-8">
          <div className="font-black text-content-muted uppercase tracking-widest text-[10px]">Perguntas Recentes</div>

          {isLoading ? (
            <div className="text-content-muted text-sm">Carregando...</div>
          ) : questions.length === 0 ? (
            <div className="text-content-muted text-sm">Nenhuma pergunta ainda. Seja o primeiro!</div>
          ) : (
            <div className="flex flex-col gap-10">
              {questions.slice(0, 5).map((item) => (
                <div key={item.id} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-0.5">
                      <div className="text-[10px] font-black uppercase tracking-widest text-content-muted">
                        {item.user?.name ?? "Comprador"} • {formatRelativeDate(item.createdAt)}
                      </div>
                      <div className="font-black text-content-primary leading-tight text-lg">{item.content}</div>
                    </div>
                    {item.answer ? (
                      <div className="flex flex-col gap-1 pl-4 border-l-2 border-gold/40 mt-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gold">ArcturoShop</div>
                        <div className="text-sm text-content-primary font-medium leading-relaxed">{item.answer}</div>
                      </div>
                    ) : (
                      <div className="text-[13px] text-content-muted font-medium italic pl-4">Aguardando resposta...</div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div />
                    {isAdmin && !item.answer && (
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setReplyingTo(replyingTo === item.id ? null : item.id);
                          setReplyText("");
                        }}
                        className="h-auto p-0 text-[11px] font-black text-gold uppercase tracking-widest hover:bg-transparent flex items-center gap-1.5"
                      >
                        <MessageSquareReply className="size-3.5" />
                        Responder
                      </Button>
                    )}
                  </div>

                  {isAdmin && replyingTo === item.id && (
                    <div className="flex flex-col gap-3 pl-4 border-l-2 border-gold">
                      <Textarea
                        placeholder="Digite a resposta..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="resize-none bg-obsidian-nav border-border text-content-primary text-sm"
                        rows={3}
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAnswer(item.id)}
                          disabled={isAnswering || !replyText.trim()}
                          className="h-9 px-5 bg-gold text-obsidian-nav hover:bg-gold/90 font-black text-xs uppercase tracking-widest rounded-full disabled:opacity-50"
                        >
                          {isAnswering ? "Salvando..." : "Publicar resposta"}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => { setReplyingTo(null); setReplyText(""); }}
                          className="h-9 px-4 text-xs font-bold text-content-muted hover:text-content-primary hover:bg-transparent uppercase tracking-widest"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {questions.length > 5 && (
            <Button variant="link" className="text-gold font-black text-sm hover:underline w-fit uppercase tracking-widest p-0 h-auto">
              Ver todas as {questions.length} perguntas
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductQuestions;

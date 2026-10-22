import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProductReviews,
  getProductQuestions,
  createProductReview,
  createProductQuestion,
  answerProductQuestion,
  deleteProductQuestion,
  CreateReviewPayload,
  CreateQuestionPayload,
} from "@/lib/api/product-interaction-service";

export const useProductReviews = (productId: string) =>
  useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: () => getProductReviews(productId),
    enabled: !!productId,
  });

export const useProductQuestions = (productId: string) =>
  useQuery({
    queryKey: ["product-questions", productId],
    queryFn: () => getProductQuestions(productId),
    enabled: !!productId,
  });

export const useCreateReview = (productId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) => createProductReview(productId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product-reviews", productId] }),
  });
};

export const useCreateQuestion = (productId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateQuestionPayload) => createProductQuestion(productId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product-questions", productId] }),
  });
};

export const useAnswerQuestion = (productId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, answer }: { questionId: string; answer: string }) =>
      answerProductQuestion(questionId, answer),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product-questions", productId] }),
  });
};

export const useDeleteQuestion = (productId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (questionId: string) => deleteProductQuestion(questionId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["product-questions", productId] }),
  });
};

import { api } from "./axios";

export interface ProductReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: string; name: string | null };
}

export interface ProductQuestion {
  id: string;
  content: string;
  answer: string | null;
  createdAt: string;
  user: { id: string; name: string | null };
}

export interface CreateReviewPayload {
  rating: number;
  comment?: string;
}

export interface CreateQuestionPayload {
  content: string;
}

export const getProductReviews = async (productId: string): Promise<ProductReview[]> => {
  const response = await api.get(`/products/${productId}/reviews`);
  return response.data.data ?? [];
};

export const getProductQuestions = async (productId: string): Promise<ProductQuestion[]> => {
  const response = await api.get(`/products/${productId}/questions`);
  return response.data.data ?? [];
};

export const createProductReview = async (
  productId: string,
  payload: CreateReviewPayload
): Promise<ProductReview> => {
  const response = await api.post(`/products/${productId}/reviews`, payload);
  return response.data.data;
};

export const createProductQuestion = async (
  productId: string,
  payload: CreateQuestionPayload
): Promise<ProductQuestion> => {
  const response = await api.post(`/products/${productId}/questions`, payload);
  return response.data.data;
};

export const answerProductQuestion = async (
  questionId: string,
  answer: string
): Promise<ProductQuestion> => {
  const response = await api.patch(`/products/questions/${questionId}/answer`, { answer });
  return response.data.data;
};

export const deleteProductQuestion = async (questionId: string): Promise<void> => {
  await api.delete(`/products/questions/${questionId}`);
};

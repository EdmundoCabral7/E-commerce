import { AppError } from '../middlewares/errorHandler';
import { QuestionRepository } from '../repositories/question.repository';
import { ReviewRepository } from '../repositories/review.repository';
import { FavoriteRepository } from '../repositories/favorite.repository';
import { ProductRepository } from '../repositories/product.repository';
import { CreateQuestionDTO, CreateReviewDTO } from '../schemas/product-interaction.schema';

const questionRepository = new QuestionRepository();
const reviewRepository = new ReviewRepository();
const favoriteRepository = new FavoriteRepository();
const productRepository = new ProductRepository();

export class ProductInteractionService {

  async createQuestion(userId: string, productId: string, data: CreateQuestionDTO) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }

    return questionRepository.create({
      userId,
      productId,
      content: data.content,
    });
  }


  async createReview(userId: string, productId: string, data: CreateReviewDTO) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }


    const existingReview = await reviewRepository.findByUserAndProduct(userId, productId);
    if (existingReview) {
      throw new AppError('Você já avaliou este produto', 409);
    }

    return reviewRepository.create({
      userId,
      productId,
      rating: data.rating,
      comment: data.comment,
    });
  }


  async toggleFavorite(userId: string, productId: string) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }

    const existingFavorite = await favoriteRepository.findByUserAndProduct(userId, productId);

    if (existingFavorite) {
      await favoriteRepository.remove(userId, productId);
      return { favorited: false };
    } else {
      await favoriteRepository.add(userId, productId);
      return { favorited: true };
    }
  }


  async getFavorites(userId: string) {
    return favoriteRepository.findAllByUser(userId);
  }

  async getReviews(productId: string) {
    return reviewRepository.findByProductId(productId);
  }

  async getQuestions(productId: string) {
    return questionRepository.findByProductId(productId);
  }

  async answerQuestion(questionId: string, answer: string) {
    return questionRepository.answerQuestion(questionId, answer);
  }

  async deleteQuestion(questionId: string) {
    return questionRepository.deleteQuestion(questionId);
  }
}

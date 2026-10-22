import { Request, Response, NextFunction } from 'express';
import { ProductInteractionService } from '../services/product-interaction.service';
import { createQuestionSchema, createReviewSchema } from '../schemas/product-interaction.schema';

const interactionService = new ProductInteractionService();

export class ProductInteractionController {
 
  async createQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = String(req.params.id);
      const userId = req.user!.id;

      const parsed = createQuestionSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          data: null,
          error: {
            message: 'Erro de validação',
            details: parsed.error.flatten().fieldErrors
          }
        });
        return;
      }

      const question = await interactionService.createQuestion(userId, productId, parsed.data);
      res.status(201).json({
        success: true,
        data: question,
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  
  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = String(req.params.id);
      const userId = req.user!.id;

      const parsed = createReviewSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          success: false,
          data: null,
          error: {
            message: 'Erro de validação',
            details: parsed.error.flatten().fieldErrors
          }
        });
        return;
      }

      const review = await interactionService.createReview(userId, productId, parsed.data);
      res.status(201).json({
        success: true,
        data: review,
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

  
  async toggleFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = String(req.params.id);
      const userId = req.user!.id;

      const result = await interactionService.toggleFavorite(userId, productId);
      res.status(200).json({
        success: true,
        data: result,
        error: null
      });
    } catch (error) {
      next(error);
    }
  }

 
  async getFavorites(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const favorites = await interactionService.getFavorites(userId);
      res.status(200).json({ success: true, data: favorites, error: null });
    } catch (error) {
      next(error);
    }
  }

  async getReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = String(req.params.id);
      const reviews = await interactionService.getReviews(productId);
      res.status(200).json({ success: true, data: reviews, error: null });
    } catch (error) {
      next(error);
    }
  }

  async getQuestions(req: Request, res: Response, next: NextFunction) {
    try {
      const productId = String(req.params.id);
      const questions = await interactionService.getQuestions(productId);
      res.status(200).json({ success: true, data: questions, error: null });
    } catch (error) {
      next(error);
    }
  }

  async answerQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      const { answer } = req.body;
      if (!answer || typeof answer !== 'string' || !answer.trim()) {
        res.status(400).json({ success: false, data: null, error: { message: 'Resposta é obrigatória' } });
        return;
      }
      const question = await interactionService.answerQuestion(req.params.questionId, answer.trim());
      res.status(200).json({ success: true, data: question, error: null });
    } catch (error) {
      next(error);
    }
  }

  async deleteQuestion(req: Request, res: Response, next: NextFunction) {
    try {
      await interactionService.deleteQuestion(req.params.questionId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

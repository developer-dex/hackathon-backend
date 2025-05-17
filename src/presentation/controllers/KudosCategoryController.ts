import { Request, Response } from 'express';
import { CreateKudosCategory } from '../../application/useCases/category/CreateKudosCategory';
import { GetAllKudosCategories } from '../../application/useCases/category/GetAllKudosCategories';
import { CreateKudosCategoryDTO } from '../../dtos/KudosCategoryDto';
import { validateCategoryRequest } from '../validation/categoryValidation';
import { ResponseMapper } from '../../mappers/ResponseMapper';

export class KudosCategoryController {
  constructor(
    private createKudosCategoryUseCase: CreateKudosCategory,
    private getAllKudosCategoriesUseCase: GetAllKudosCategories
  ) {}

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      // Validate request data
      const { error, value } = validateCategoryRequest(req.body);
      
      if (error) {
        const errorMessage = error.details.map((detail: any) => detail.message).join(', ');
        const response = ResponseMapper.validationError(errorMessage);
        res.status(400).json(response);
        return;
      }
      
      // Execute use case
      const categoryRequest: CreateKudosCategoryDTO = value;
      
      const result = await this.createKudosCategoryUseCase.execute(categoryRequest);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        // Determine appropriate status code based on error
        const statusCode = result.error?.includes('already exists') ? 409 : 400;
        res.status(statusCode).json(result);
      }
    } catch (error) {
      const response = ResponseMapper.serverError(error instanceof Error ? error : undefined);
      res.status(500).json(response);
    }
  }

  async getAllCategories(req: Request, res: Response): Promise<void> {
    try {
      // Get "activeOnly" parameter from query
      const activeOnly = req.query.activeOnly !== 'false';
      
      // Execute use case
      const result = await this.getAllKudosCategoriesUseCase.execute(activeOnly);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (error) {
      const response = ResponseMapper.serverError(error instanceof Error ? error : undefined);
      res.status(500).json(response);
    }
  }
} 
import { response, Response } from 'express';
import { CreateKudos } from '../../application/useCases/kudos/CreateKudos';
import { GetAllKudos } from '../../application/useCases/kudos/GetAllKudos';
import { CreateKudosDTO } from '../../dtos/KudosDto';
import { validateKudosRequest } from '../validation/kudosValidation';
import { ResponseMapper } from '../../mappers/ResponseMapper';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { KudosFilters } from '../../domain/interfaces/repositories/KudosRepository';
import { KudosMapper } from '../../mappers/KudosMapper';

export class KudosController {
  constructor(
    private createKudosUseCase: CreateKudos,
    private getAllKudosUseCase: GetAllKudos
  ) {}

  async createKudos(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const currentUser = req.user;
      console.log(currentUser);
      
      if (!currentUser) {
        const response = ResponseMapper.unauthorized('Authentication required');
        res.status(response.statusCode).json(response);
        return;
      }
      
      const kudosData = {
        ...req.body,
        senderId: currentUser.id
      };
      
      const { error, value } = validateKudosRequest(kudosData);
      
      if (error) {
        const errorMessage = error.details.map((detail: any) => detail.message).join(', ');
        const response = ResponseMapper.validationError(errorMessage);
        res.status(response.statusCode).json(response);
        return;
      }
      
      // Execute use case
      const kudosRequest: CreateKudosDTO = value;
      
      const result = await this.createKudosUseCase.execute(kudosRequest, currentUser);
      const response = ResponseMapper.success(result, 'Kudos created successfully');
      
      if (result.success) {
        res.status(201).json(response);
      } else {
        const statusCode = result.error?.includes('only team leads') ? 403 : 400;
        const response = ResponseMapper.serverError(new Error('Failed to create kudos'));
        res.status(statusCode).json(response);
      }
    } catch (error) {
      const response = ResponseMapper.serverError(error instanceof Error ? error : undefined);
      res.status(response.statusCode).json(response);
    }
  }

  async getAllKudos(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      const filters: KudosFilters = {};
      
      if (req.query.teamId) {
        filters.teamId = req.query.teamId as string;
      }
      
      if (req.query.categoryId) {
        filters.categoryId = req.query.categoryId as string;
      }
      
      if (req.query.senderId) {
        filters.senderId = req.query.senderId as string;
      }
      
      if (req.query.receiverId) {
        filters.receiverId = req.query.receiverId as string;
      }
      
      const result = await this.getAllKudosUseCase.execute(limit, offset, Object.keys(filters).length > 0 ? filters : undefined);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(result.statusCode).json(response);
      }
    } catch (error) {
      const response = ResponseMapper.serverError(error instanceof Error ? error : undefined);
      res.status(response.statusCode).json(response);
    }
  }
} 
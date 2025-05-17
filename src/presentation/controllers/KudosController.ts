import { Response } from 'express';
import { CreateKudos } from '../../application/useCases/kudos/CreateKudos';
import { GetAllKudos } from '../../application/useCases/kudos/GetAllKudos';
import { CreateKudosDTO } from '../../dtos/KudosDto';
import { validateKudosRequest } from '../validation/kudosValidation';
import { ResponseMapper } from '../../mappers/ResponseMapper';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { KudosFilters } from '../../domain/interfaces/repositories/KudosRepository';

export class KudosController {
  constructor(
    private createKudosUseCase: CreateKudos,
    private getAllKudosUseCase: GetAllKudos
  ) {}

  async createKudos(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Get the current user from request (set by auth middleware)
      const currentUser = req.user;
      console.log(currentUser);
      
      if (!currentUser) {
        const response = ResponseMapper.unauthorized('Authentication required');
        res.status(401).json(response);
        return;
      }
      
      // Add the current user's ID as the sender
      const kudosData = {
        ...req.body,
        senderId: currentUser.id
      };
      
      // Validate request data
      const { error, value } = validateKudosRequest(kudosData);
      
      if (error) {
        const errorMessage = error.details.map((detail: any) => detail.message).join(', ');
        const response = ResponseMapper.validationError(errorMessage);
        res.status(400).json(response);
        return;
      }
      
      // Execute use case
      const kudosRequest: CreateKudosDTO = value;
      
      const result = await this.createKudosUseCase.execute(kudosRequest, currentUser);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        // Determine appropriate status code based on error
        const statusCode = result.error?.includes('only team leads') ? 403 : 400;
        res.status(statusCode).json(result);
      }
    } catch (error) {
      const response = ResponseMapper.serverError(error instanceof Error ? error : undefined);
      res.status(500).json(response);
    }
  }

  async getAllKudos(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Get pagination parameters
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      
      // Build filters from query parameters
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
      
      // Execute use case with filters
      const result = await this.getAllKudosUseCase.execute(limit, offset, Object.keys(filters).length > 0 ? filters : undefined);
      
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
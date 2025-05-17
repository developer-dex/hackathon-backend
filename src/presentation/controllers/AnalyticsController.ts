import { Response } from 'express';
import { GetAnalytics } from '../../application/useCases/analytics/GetAnalytics';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { AnalyticsRequestDto, TimePeriod } from '../../dtos/AnalyticsDto';
import { ResponseMapper } from '../../mappers/ResponseMapper';

export class AnalyticsController {
  constructor(private getAnalyticsUseCase: GetAnalytics) {}

  async getAnalytics(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // Check if user is authenticated
      if (!req.user) {
        const response = ResponseMapper.unauthorized('Authentication required');
        res.status(response.statusCode).json(response);
        return;
      }
      
      // Extract query parameters
      const timePeriod = this.validateTimePeriod(req.query.timePeriod as string);
      const teamId = req.query.teamId as string;
      const categoryId = req.query.categoryId as string;
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      // Build request object
      const request: AnalyticsRequestDto = {
        timePeriod,
        ...(teamId && { teamId }),
        ...(categoryId && { categoryId }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(limit && { limit })
      };
      
      // Execute use case
      const result = await this.getAnalyticsUseCase.execute(request);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(result.statusCode).json(result);
      }
    } catch (error) {
      const response = ResponseMapper.serverError(error instanceof Error ? error : undefined);
      res.status(response.statusCode).json(response);
    }
  }
  
  /**
   * Validate and return the time period from the request
   * Default to MONTHLY if invalid
   */
  private validateTimePeriod(timePeriod?: string): TimePeriod {
    if (!timePeriod) {
      return TimePeriod.MONTHLY;
    }
    
    const period = timePeriod.toLowerCase();
    
    switch (period) {
      case 'weekly':
        return TimePeriod.WEEKLY;
      case 'monthly':
        return TimePeriod.MONTHLY;
      case 'quarterly':
        return TimePeriod.QUARTERLY;
      case 'yearly':
        return TimePeriod.YEARLY;
      default:
        return TimePeriod.MONTHLY;
    }
  }
} 
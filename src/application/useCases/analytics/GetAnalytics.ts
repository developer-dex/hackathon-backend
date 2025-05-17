import { ApiResponseDto } from '../../../dtos/ApiResponseDto';
import { AnalyticsRequestDto, AnalyticsResponseDto } from '../../../dtos/AnalyticsDto';
import { IAnalyticsRepository } from '../../../domain/interfaces/repositories/IAnalyticsRepository';
import { ResponseMapper } from '../../../mappers/ResponseMapper';

export class GetAnalytics {
  constructor(private analyticsRepository: IAnalyticsRepository) {}

  async execute(request: AnalyticsRequestDto): Promise<ApiResponseDto<AnalyticsResponseDto>> {
    try {
      const analyticsData = await this.analyticsRepository.getAnalytics(request);

      
      
      return ResponseMapper.success(
        analyticsData,
        `Analytics data retrieved successfully`
      );
    } catch (error) {
      return ResponseMapper.serverError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
} 
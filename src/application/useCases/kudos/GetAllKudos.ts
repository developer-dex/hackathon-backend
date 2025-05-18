import { ApiResponseDto } from '../../../dtos/ApiResponseDto';
import { KudosListItemDTO } from '../../../dtos/KudosDto';
import { IKudosRepository, KudosFilters } from '../../../domain/interfaces/repositories/KudosRepository';
import { ResponseMapper } from '../../../mappers/ResponseMapper';

export class GetAllKudos {
  constructor(private kudosRepository: IKudosRepository) {}

  async execute(
    limit?: number, 
    page?: number, 
    filters?: KudosFilters
  ): Promise<ApiResponseDto<KudosListItemDTO[]>> {
    try {
      const kudosItems = await this.kudosRepository.getAllKudosPopulated(limit, page, filters);
      
      const total = await this.kudosRepository.getTotalCount(filters);
      
      const paginationMeta = (limit !== undefined || page !== undefined) 
        ? { total, page, limit: limit || kudosItems.length }
        : undefined;
      
      return ResponseMapper.success(
        kudosItems,
        `Retrieved ${kudosItems.length} kudos successfully`,
        paginationMeta
      );
    } catch (error) {
      return ResponseMapper.serverError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
} 
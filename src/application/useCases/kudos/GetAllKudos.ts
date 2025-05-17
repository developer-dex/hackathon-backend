import { ApiResponseDto } from '../../../dtos/ApiResponseDto';
import { KudosListItemDTO } from '../../../dtos/KudosDto';
import { IKudosRepository, KudosFilters } from '../../../domain/interfaces/repositories/KudosRepository';
import { ResponseMapper } from '../../../mappers/ResponseMapper';

export class GetAllKudos {
  constructor(private kudosRepository: IKudosRepository) {}

  async execute(
    limit?: number, 
    offset?: number, 
    filters?: KudosFilters
  ): Promise<ApiResponseDto<KudosListItemDTO[]>> {
    try {
      const skip = (offset ? offset - 1 : 0) * (limit || 0);
      // Get all kudos with populated sender, receiver, and category
      const kudosItems = await this.kudosRepository.getAllKudosPopulated(limit, skip, filters);
      
      // Count total for pagination
      const total = await this.kudosRepository.getTotalCount(filters);
      
      return ResponseMapper.success(
        kudosItems,
        `Retrieved ${kudosItems.length} kudos successfully`,
        { total, offset: offset || 0, limit: limit || kudosItems.length }
      );
    } catch (error) {
      return ResponseMapper.serverError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
} 
import { ApiResponseDto } from '../../../dtos/ApiResponseDto';
import { KudosListItemDTO } from '../../../dtos/KudosDto';
import { IKudosRepository } from '../../../domain/interfaces/repositories/KudosRepository';
import { ResponseMapper } from '../../../mappers/ResponseMapper';

export class GetAllKudos {
  constructor(private kudosRepository: IKudosRepository) {}

  async execute(limit?: number, offset?: number): Promise<ApiResponseDto<KudosListItemDTO[]>> {
    try {
      // Get all kudos with populated sender, receiver, and category
      const kudosItems = await this.kudosRepository.getAllKudosPopulated(limit, offset);
      
      // Count total for pagination
      const total = await this.kudosRepository.getTotalCount();
      
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
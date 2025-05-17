import { ApiResponseDto } from '../../../dtos/ApiResponseDto';
import { KudosCategoryDTO } from '../../../dtos/KudosCategoryDto';
import { IKudosCategoryRepository } from '../../../domain/interfaces/repositories/KudosCategoryRepository';
import { KudosCategoryMapper } from '../../../mappers/KudosCategoryMapper';
import { ResponseMapper } from '../../../mappers/ResponseMapper';

export class GetAllKudosCategories {
  constructor(private kudosCategoryRepository: IKudosCategoryRepository) {}

  async execute(): Promise<ApiResponseDto<KudosCategoryDTO[]>> {
    try {
      // Get all categories
      const retriveCategories = await this.kudosCategoryRepository.getAllCategories();
      
      // Map to DTOs
      const categories = retriveCategories.map(category => KudosCategoryMapper.toDTO(category));
      
      return ResponseMapper.success(
        categories,
        'Categories retrieved successfully'
      );
    } catch (error) {
      return ResponseMapper.serverError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
} 
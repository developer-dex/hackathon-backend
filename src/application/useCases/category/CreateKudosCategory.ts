import { ApiResponseDto } from '../../../dtos/ApiResponseDto';
import { CreateKudosCategoryDTO, KudosCategoryDTO } from '../../../dtos/KudosCategoryDto';
import { IKudosCategoryRepository } from '../../../domain/interfaces/repositories/KudosCategoryRepository';
import { KudosCategoryMapper } from '../../../mappers/KudosCategoryMapper';
import { ResponseMapper } from '../../../mappers/ResponseMapper';

export class CreateKudosCategory {
  constructor(private kudosCategoryRepository: IKudosCategoryRepository) {}

  async execute(dto: CreateKudosCategoryDTO): Promise<ApiResponseDto<KudosCategoryDTO>> {
    try {
      const existingCategory = await this.kudosCategoryRepository.getCategoryByName(dto.name);
      
      if (existingCategory) {
        return ResponseMapper.validationError(`Category with name "${dto.name}" already exists`);
      }
      
      const newCategory = await this.kudosCategoryRepository.createCategory(dto);
      
      if (!newCategory) {
        return ResponseMapper.serverError(new Error('Failed to create category'));
      }
      
      const categoryDTO = KudosCategoryMapper.toDTO(newCategory);
      
      return ResponseMapper.success(
        categoryDTO,
        'Category created successfully'
      );
    } catch (error) {
      return ResponseMapper.serverError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
} 
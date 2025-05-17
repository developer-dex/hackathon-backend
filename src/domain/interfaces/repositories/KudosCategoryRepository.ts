import { KudosCategory } from '../../entities/KudosCategory';
import { CreateKudosCategoryDTO, UpdateKudosCategoryDTO } from '../../../dtos/KudosCategoryDto';

export interface IKudosCategoryRepository {
  createCategory(categoryData: CreateKudosCategoryDTO): Promise<KudosCategory | null>;
  getCategoryById(id: string): Promise<KudosCategory | null>;
  getCategoryByName(name: string): Promise<KudosCategory | null>;
  getAllCategories(activeOnly?: boolean): Promise<KudosCategory[]>;
  updateCategory(id: string, categoryData: UpdateKudosCategoryDTO): Promise<KudosCategory | null>;
  deleteCategory(id: string): Promise<boolean>;
  initializeDefaultCategories(): Promise<void>;
} 
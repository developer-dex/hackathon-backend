import { IKudosCategoryRepository } from '../../domain/interfaces/repositories/KudosCategoryRepository';
import { KudosCategory } from '../../domain/entities/KudosCategory';
import { CreateKudosCategoryDTO, UpdateKudosCategoryDTO } from '../../dtos/KudosCategoryDto';
import { KudosCategoryModel } from '../database/models/KudosCategoryModel';
import { KudosCategoryMapper } from '../../mappers/KudosCategoryMapper';

export class KudosCategoryRepositoryImpl implements IKudosCategoryRepository {
  async createCategory(categoryData: CreateKudosCategoryDTO): Promise<KudosCategory | null> {
    try {
      const formattedData = {
        ...categoryData,
        name: categoryData.name.toUpperCase()
      };
      
      const newCategory = new KudosCategoryModel(formattedData);
      const savedCategory = await newCategory.save();
      
      return KudosCategoryMapper.toDomain(savedCategory);
    } catch (error) {
      console.error('Error creating category:', error);
      return null;
    }
  }

  async getCategoryById(id: string): Promise<KudosCategory | null> {
    try {
      const category = await KudosCategoryModel.findById(id);
      return KudosCategoryMapper.toDomain(category);
    } catch (error) {
      console.error('Error getting category by ID:', error);
      return null;
    }
  }

  async getCategoryByName(name: string): Promise<KudosCategory | null> {
    try {
      const category = await KudosCategoryModel.findOne({ 
        name: name.toUpperCase() 
      });
      return KudosCategoryMapper.toDomain(category);
    } catch (error) {
      console.error('Error getting category by name:', error);
      return null;
    }
  }

  async getAllCategories(): Promise<KudosCategory[]> {
    try {
      const query = { isActive: true };
      const categories = await KudosCategoryModel.find(query).sort({ name: 1 });
      return KudosCategoryMapper.toDomainList(categories);
    } catch (error) {
      console.error('Error getting all categories:', error);
      return [];
    }
  }

  async updateCategory(id: string, categoryData: UpdateKudosCategoryDTO): Promise<KudosCategory | null> {
    try {
      const formattedData = { ...categoryData };
      if (formattedData.name) {
        formattedData.name = formattedData.name.toUpperCase();
      }
      
      const updatedCategory = await KudosCategoryModel.findByIdAndUpdate(
        id,
        { $set: formattedData },
        { new: true, runValidators: true }
      );
      
      return KudosCategoryMapper.toDomain(updatedCategory);
    } catch (error) {
      console.error('Error updating category:', error);
      return null;
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    try {
      const result = await KudosCategoryModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting category:', error);
      return false;
    }
  }
} 
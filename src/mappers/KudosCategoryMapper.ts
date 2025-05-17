import { KudosCategory } from '../domain/entities/KudosCategory';
import { KudosCategoryDTO } from '../dtos/KudosCategoryDto';
import { KudosCategoryDocument } from '../infrastructure/database/models/KudosCategoryModel';

/**
 * KudosCategoryMapper - Responsible for transforming KudosCategory objects between different layers
 */
export class KudosCategoryMapper {
  /**
   * Map from KudosCategory entity to KudosCategoryDTO
   */
  public static toDTO(category: KudosCategory): KudosCategoryDTO {
    return {
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      isActive: category.isActive,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt
    };
  }

  /**
   * Map from MongoDB document to KudosCategory domain entity
   */
  public static toDomain(categoryDocument: KudosCategoryDocument | null): KudosCategory | null {
    if (!categoryDocument) {
      return null;
    }

    return KudosCategory.create({
      id: categoryDocument._id.toString(),
      name: categoryDocument.name,
      description: categoryDocument.description,
      icon: categoryDocument.icon,
      color: categoryDocument.color,
      isActive: categoryDocument.isActive,
      createdAt: categoryDocument.createdAt.toISOString(),
      updatedAt: categoryDocument.updatedAt.toISOString()
    });
  }

  /**
   * Map from MongoDB document to KudosCategory domain entity (for multiple documents)
   */
  public static toDomainList(categoryDocuments: KudosCategoryDocument[]): KudosCategory[] {
    return categoryDocuments.map(doc => this.toDomain(doc)!).filter(Boolean);
  }
} 
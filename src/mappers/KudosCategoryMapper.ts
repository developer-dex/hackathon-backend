import { KudosCategory } from '../domain/entities/KudosCategory';
import { KudosCategoryDTO } from '../dtos/KudosCategoryDto';
import { KudosCategoryDocument } from '../infrastructure/database/models/KudosCategoryModel';
import { getIconUrl } from '../infrastructure/services/FileUploadService';

/**
 * KudosCategoryMapper - Responsible for transforming KudosCategory objects between different layers
 */
export class KudosCategoryMapper {
  /**
   * Map from KudosCategory entity to KudosCategoryDTO
   */
  public static toDTO(category: KudosCategory): KudosCategoryDTO {
    return {
      id: category.getId(),
      name: category.getName(),
      description: category.getDescription(),
      icon: category.getIcon(),
      iconUrl: this.getFullIconUrl(category.getIcon()),
      color: category.getColor(),
      isActive: category.getIsActive(),
      createdAt: category.getCreatedAt(),
      updatedAt: category.getUpdatedAt()
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

  /**
   * Get full URL for an icon file
   */
  private static getFullIconUrl(iconPath: string): string {
    // For default icons (those without a file extension), return as is
    if (!iconPath.includes('.')) {
      return iconPath;
    }
    
    // For uploaded files, generate proper URL
    return getIconUrl(iconPath);
  }
} 
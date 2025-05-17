import { Kudos } from '../domain/entities/Kudos';
import { KudosDTO, KudosListItemDTO } from '../dtos/KudosDto';
import { KudosDocument } from '../infrastructure/database/models/KudosModel';
import { UserMapper } from './UserMapper';
import { UserDocument } from '../infrastructure/database/models/UserModel';
import { KudosCategoryDocument } from '../infrastructure/database/models/KudosCategoryModel';
import { KudosCategoryMapper } from './KudosCategoryMapper';

/**
 * KudosMapper - Responsible for transforming Kudos objects between different layers
 * Following Clean Architecture principles to maintain separation of concerns
 */
export class KudosMapper {
  /**
   * Map from Kudos entity to KudosDTO (for API responses)
   * Requires populated sender, receiver, and category objects
   */
  public static toDTO(
    kudos: Kudos, 
    senderDoc: UserDocument, 
    receiverDoc: UserDocument,
    categoryDoc: KudosCategoryDocument
  ): KudosDTO {
    return {
      id: kudos.id,
      sender: UserMapper.documentToDTO(senderDoc)!,
      receiver: UserMapper.documentToDTO(receiverDoc)!,
      category: KudosCategoryMapper.toDomain(categoryDoc)!,
      message: kudos.message,
      teamName: kudos.teamName,
      createdAt: kudos.createdAt,
      updatedAt: kudos.updatedAt
    };
  }

  /**
   * Map from Kudos entity to KudosListItemDTO (for list views)
   * Requires populated sender, receiver, and category objects
   */
  public static toListItemDTO(
    kudos: Kudos, 
    senderDoc: UserDocument, 
    receiverDoc: UserDocument,
    categoryDoc: KudosCategoryDocument
  ): KudosListItemDTO {
    return {
      id: kudos.id,
      sender: {
        id: senderDoc._id.toString(),
        name: senderDoc.name,
        department: senderDoc.department
      },
      receiver: {
        id: receiverDoc._id.toString(),
        name: receiverDoc.name,
        department: receiverDoc.department
      },
      category: {
        id: categoryDoc._id.toString(),
        name: categoryDoc.name,
        icon: categoryDoc.icon,
        color: categoryDoc.color
      },
      message: kudos.message,
      teamName: kudos.teamName,
      createdAt: kudos.createdAt
    };
  }

  /**
   * Map from MongoDB document to Kudos domain entity
   */
  public static toDomain(kudosDocument: KudosDocument | null): Kudos | null {
    if (!kudosDocument) {
      return null;
    }

    return Kudos.create({
      id: kudosDocument._id.toString(),
      senderId: kudosDocument.senderId.toString(),
      receiverId: kudosDocument.receiverId.toString(),
      categoryId: kudosDocument.categoryId.toString(),
      message: kudosDocument.message,
      teamName: kudosDocument.teamName,
      createdAt: kudosDocument.createdAt.toISOString(),
      updatedAt: kudosDocument.updatedAt.toISOString()
    });
  }

  /**
   * Map from MongoDB document to Kudos domain entity (for multiple documents)
   */
  public static toDomainList(kudosDocuments: KudosDocument[]): Kudos[] {
    return kudosDocuments.map(doc => this.toDomain(doc)!).filter(Boolean);
  }
} 
/**
 * Data Flow Pattern:
 * 
 * 1. Database Models/Documents -> Domain Entities (using toDomain)
 *    - Used when retrieving data from the database
 *    - Converts database-specific structures to domain entities for business logic
 * 
 * 2. Domain Entities -> DTOs (using toDTO)
 *    - Used when returning data through the API
 *    - Prepares data for external consumption, removing sensitive or unnecessary information
 * 
 * 3. Database Models/Documents -> DTOs (using documentToDTO) 
 *    - Convenience method combining toDomain and toDTO
 *    - Used when retrieving data that will be immediately sent to API without business logic
 */
import { Kudos } from '../domain/entities/Kudos';
import { KudosDTO, KudosListItemDTO } from '../dtos/KudosDto';
import { KudosDocument } from '../infrastructure/database/models/KudosModel';
import { UserMapper } from './UserMapper';
import { UserDocument } from '../infrastructure/database/models/UserModel';
import { KudosCategoryDocument } from '../infrastructure/database/models/KudosCategoryModel';
import { KudosCategoryMapper } from './KudosCategoryMapper';
import { TeamDocument } from '../infrastructure/database/models/TeamModel';
import { TeamMapper } from './TeamMapper';

/**
 * KudosMapper - Responsible for transforming Kudos objects between different layers
 * Following Clean Architecture principles to maintain separation of concerns
 */
export class KudosMapper {
  /**
   * Map from Kudos entity to KudosDTO (for API responses)
   * Requires populated sender, receiver, category, and team objects
   */
  public static toDTO(
    kudos: Kudos, 
    senderDoc: UserDocument, 
    receiverDoc: UserDocument,
    categoryDoc: KudosCategoryDocument,
    teamDoc: TeamDocument
  ): KudosDTO {
    const sender = UserMapper.documentToDTO(senderDoc)!;
    const receiver = UserMapper.documentToDTO(receiverDoc)!;
    const category = KudosCategoryMapper.toDTO(KudosCategoryMapper.toDomain(categoryDoc)!)!;
    const team = TeamMapper.documentToDTO(teamDoc)!;
    
    return {
      id: kudos.getId(),
      sender,
      receiver,
      category,
      team,
      message: kudos.getMessage(),
      createdAt: kudos.getCreatedAt(),
      updatedAt: kudos.getUpdatedAt()
    };
  }

  /**
   * Map from Kudos entity to KudosListItemDTO (for list views)
   * Requires populated sender, receiver, category, and team objects
   */
  public static toListItemDTO(
    kudos: Kudos, 
    senderDoc: UserDocument, 
    receiverDoc: UserDocument,
    categoryDoc: KudosCategoryDocument,
    teamDoc: TeamDocument
  ): KudosListItemDTO {
    const sender = UserMapper.documentToDTO(senderDoc)!;
    const receiver = UserMapper.documentToDTO(receiverDoc)!;
    const category = KudosCategoryMapper.toDTO(KudosCategoryMapper.toDomain(categoryDoc)!)!;
    const team = TeamMapper.documentToDTO(teamDoc)!;
    
    return {
      id: kudos.id,
      sender: {
        id: sender.id,
        name: sender.name,
        teamId: sender.teamId || ''
      },
      receiver: {
        id: receiver.id,
        name: receiver.name,
        teamId: receiver.teamId || ''
      },
      category: {
        id: category.id,
        name: category.name,
        icon: category.icon,
        color: category.color
      },
      team: {
        id: team.id,
        name: team.name
      },
      message: kudos.message,
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
      teamId: kudosDocument.teamId.toString(),
      message: kudosDocument.message,
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
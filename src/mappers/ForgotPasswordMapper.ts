import { ForgotPassword } from '../domain/entities/ForgotPassword';
import { Types } from 'mongoose';

/**
 * DTO for ForgotPassword
 */
export interface ForgotPasswordDTO {
  id: string;
  userId: string;
  email: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mapper for ForgotPassword entity
 */
export class ForgotPasswordMapper {
  /**
   * Convert a database document to a domain entity
   * @param document The document from the database
   * @returns A ForgotPassword domain entity or null if the document is null
   */
  static toDomain(document: any): ForgotPassword | null {
    if (!document) {
      return null;
    }

    return new ForgotPassword(
      document._id.toString(),
      document.userId.toString(),
      document.email,
      document.token,
      document.expiresAt,
      document.isUsed,
      document.createdAt,
      document.updatedAt
    );
  }

  /**
   * Convert a domain entity to a DTO
   * @param entity The ForgotPassword domain entity
   * @returns A ForgotPasswordDTO or null if the entity is null
   */
  static toDTO(entity: ForgotPassword | null): ForgotPasswordDTO | null {
    if (!entity) {
      return null;
    }

    return {
      id: entity.getId(),
      userId: entity.getUserId(),
      email: entity.getEmail(),
      token: entity.getToken(),
      expiresAt: entity.getExpiresAt(),
      isUsed: entity.getIsUsed(),
      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt()
    };
  }

  /**
   * Convert a domain entity to a persistence model
   * @param entity The ForgotPassword domain entity
   * @returns A document for the database or null if the entity is null
   */
  static toPersistence(entity: ForgotPassword | null): any | null {
    if (!entity) {
      return null;
    }

    return {
      _id: new Types.ObjectId(entity.getId()),
      userId: new Types.ObjectId(entity.getUserId()),
      email: entity.getEmail(),
      token: entity.getToken(),
      expiresAt: entity.getExpiresAt(),
      isUsed: entity.getIsUsed(),
      createdAt: entity.getCreatedAt(),
      updatedAt: entity.getUpdatedAt()
    };
  }
} 
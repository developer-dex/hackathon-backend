import { User as DomainUser, UserRole, VerificationStatus } from '../domain/entities/User';
import { User as EntityUser, VerificationStatus as EntityVerificationStatus } from '../entities/User';
import { UserDTO } from '../dtos/UserDto';
import { UserDocument } from '../infrastructure/database/models/UserModel';

/**
 * UserMapper - Responsible for transforming User objects between different layers
 * Following Clean Architecture principles to maintain separation of concerns
 */
export class UserMapper {
  /**
   * Map from User entity to UserDTO (for API responses)
   * Removes sensitive information like password
   */
  public static toDTO(user: DomainUser | EntityUser): UserDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      verificationStatus: user.verificationStatus,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  /**
   * Map from MongoDB document to User domain entity
   */
  public static toDomain(userDocument: UserDocument | null): DomainUser | null {
    if (!userDocument) {
      return null;
    }

    return DomainUser.create({
      id: userDocument._id.toString(),
      name: userDocument.name,
      email: userDocument.email,
      password: userDocument.password,
      role: userDocument.role,
      department: userDocument.department,
      verificationStatus: userDocument.verificationStatus,
      createdAt: userDocument.createdAt.toISOString(),
      updatedAt: userDocument.updatedAt.toISOString()
    });
  }

  /**
   * Map from MongoDB document directly to UserDTO (combines toDomain and toDTO)
   */
  public static documentToDTO(userDocument: UserDocument | null): UserDTO | null {
    const user = this.toDomain(userDocument);
    return user ? this.toDTO(user) : null;
  }

  /**
   * Create a token payload from a UserDTO
   */
  public static toTokenPayload(user: UserDTO): Record<string, any> {
    return {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
  }
} 
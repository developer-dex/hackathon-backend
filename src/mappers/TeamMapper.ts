import { Team } from '../domain/entities/Team';
import { TeamDTO } from '../dtos/TeamDto';
import { TeamDocument } from '../infrastructure/database/models/TeamModel';

/**
 * TeamMapper - Responsible for transforming Team objects between different layers
 */
export class TeamMapper {
  /**
   * Map from Team entity to TeamDTO
   */
  public static toDTO(team: Team): TeamDTO {
    return {
      id: team.getId(),
      name: team.getName(),
      createdAt: team.getCreatedAt(),
      updatedAt: team.getUpdatedAt()
    };
  }

  /**
   * Map from MongoDB document to Team domain entity
   */
  public static toDomain(teamDocument: TeamDocument | null): Team | null {
    if (!teamDocument) {
      return null;
    }

    return Team.create({
      id: teamDocument._id.toString(),
      name: teamDocument.name,
      createdAt: teamDocument.createdAt.toISOString(),
      updatedAt: teamDocument.updatedAt.toISOString()
    });
  }

  /**
   * Map from MongoDB document directly to TeamDTO (combines toDomain and toDTO)
   */
  public static documentToDTO(teamDocument: TeamDocument | null): TeamDTO | null {
    const team = this.toDomain(teamDocument);
    return team ? this.toDTO(team) : null;
  }

  /**
   * Map from MongoDB document to Team domain entity (for multiple documents)
   */
  public static toDomainList(teamDocuments: TeamDocument[]): Team[] {
    return teamDocuments.map(doc => this.toDomain(doc)!).filter(Boolean);
  }
} 
import { ApiResponseDto } from '../../../dtos/ApiResponseDto';
import { TeamDTO } from '../../../dtos/TeamDto';
import { ITeamRepository } from '../../../domain/interfaces/repositories/TeamRepository';
import { ResponseMapper } from '../../../mappers/ResponseMapper';
import { TeamMapper } from '../../../mappers/TeamMapper';

export class GetTeamById {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(id: string): Promise<ApiResponseDto<TeamDTO>> {
    try {
      // Get team by ID
      const team = await this.teamRepository.getTeamById(id);
      
      if (!team) {
        return ResponseMapper.notFound('Team');
      }

      // Map to DTO
      const teamDTO = TeamMapper.toDTO(team);
      
      return ResponseMapper.success(
        teamDTO,
        'Team retrieved successfully'
      );
    } catch (error) {
      return ResponseMapper.serverError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
} 
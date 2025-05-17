import { ApiResponseDto } from '../../../dtos/ApiResponseDto';
import { CreateTeamDTO, TeamDTO } from '../../../dtos/TeamDto';
import { ITeamRepository } from '../../../domain/interfaces/repositories/TeamRepository';
import { ResponseMapper } from '../../../mappers/ResponseMapper';
import { TeamMapper } from '../../../mappers/TeamMapper';

export class CreateTeam {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(dto: CreateTeamDTO): Promise<ApiResponseDto<TeamDTO>> {
    try {
      // Create the team
      const team = await this.teamRepository.createTeam(dto);
      
      if (!team) {
        return ResponseMapper.serverError(new Error('Failed to create team'));
      }

      // Map to DTO
      const teamDTO = TeamMapper.toDTO(team);
      
      return ResponseMapper.success(
        teamDTO,
        'Team created successfully'
      );
    } catch (error) {
      return ResponseMapper.serverError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
} 
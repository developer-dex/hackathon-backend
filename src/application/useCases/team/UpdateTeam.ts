import { ApiResponseDto } from '../../../dtos/ApiResponseDto';
import { CreateTeamDTO, TeamDTO } from '../../../dtos/TeamDto';
import { ITeamRepository } from '../../../domain/interfaces/repositories/TeamRepository';
import { ResponseMapper } from '../../../mappers/ResponseMapper';
import { TeamMapper } from '../../../mappers/TeamMapper';

export class UpdateTeam {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(id: string, dto: Partial<CreateTeamDTO>): Promise<ApiResponseDto<TeamDTO>> {
    try {
      const existingTeam = await this.teamRepository.getTeamById(id);
      
      if (!existingTeam) {
        return ResponseMapper.notFound('Team');
      }

      const updatedTeam = await this.teamRepository.updateTeam(id, dto);
      
      if (!updatedTeam) {
        return ResponseMapper.serverError(new Error('Failed to update team'));
      }

      const teamDTO = TeamMapper.toDTO(updatedTeam);
      
      return ResponseMapper.success(
        teamDTO,
        'Team updated successfully'
      );
    } catch (error) {
      return ResponseMapper.serverError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
} 
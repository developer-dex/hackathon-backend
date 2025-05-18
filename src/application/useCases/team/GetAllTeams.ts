import { ApiResponseDto } from '../../../dtos/ApiResponseDto';
import { TeamDTO } from '../../../dtos/TeamDto';
import { ITeamRepository } from '../../../domain/interfaces/repositories/TeamRepository';
import { ResponseMapper } from '../../../mappers/ResponseMapper';
import { TeamMapper } from '../../../mappers/TeamMapper';

export class GetAllTeams {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(): Promise<ApiResponseDto<TeamDTO[]>> {
    try {
      const teams = await this.teamRepository.getAllTeams();
      
      const teamDTOs = teams.map(team => TeamMapper.toDTO(team));
      
      return ResponseMapper.success(
        teamDTOs,
        `Retrieved ${teamDTOs.length} teams successfully`
      );
    } catch (error) {
      return ResponseMapper.serverError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
} 
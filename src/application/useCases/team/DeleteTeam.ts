import { ApiResponseDto } from '../../../dtos/ApiResponseDto';
import { ITeamRepository } from '../../../domain/interfaces/repositories/TeamRepository';
import { ResponseMapper } from '../../../mappers/ResponseMapper';

export class DeleteTeam {
  constructor(private teamRepository: ITeamRepository) {}

  async execute(id: string): Promise<ApiResponseDto<boolean>> {
    try {
      // Check if team exists
      const existingTeam = await this.teamRepository.getTeamById(id);
      
      if (!existingTeam) {
        return ResponseMapper.notFound('Team');
      }

      // Delete the team
      const deleted = await this.teamRepository.deleteTeam(id);
      
      if (!deleted) {
        return ResponseMapper.serverError(new Error('Failed to delete team'));
      }
      
      return ResponseMapper.success(
        true,
        'Team deleted successfully'
      );
    } catch (error) {
      return ResponseMapper.serverError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
} 
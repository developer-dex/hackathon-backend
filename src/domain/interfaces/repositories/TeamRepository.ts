import { Team } from '../../entities/Team';
import { CreateTeamDTO } from '../../../dtos/TeamDto';

export interface ITeamRepository {
  createTeam(teamData: CreateTeamDTO): Promise<Team | null>;
  getTeamById(id: string): Promise<Team | null>;
  getAllTeams(): Promise<Team[]>;
  updateTeam(id: string, teamData: Partial<CreateTeamDTO>): Promise<Team | null>;
  deleteTeam(id: string): Promise<boolean>;
} 
import { ITeamRepository } from '../../domain/interfaces/repositories/TeamRepository';
import { Team } from '../../domain/entities/Team';
import { CreateTeamDTO } from '../../dtos/TeamDto';
import { TeamModel } from '../database/models/TeamModel';
import { TeamMapper } from '../../mappers/TeamMapper';

export class TeamRepositoryImpl implements ITeamRepository {
  async createTeam(teamData: CreateTeamDTO): Promise<Team | null> {
    try {
      const newTeam = new TeamModel(teamData);
      const savedTeam = await newTeam.save();
      
      return TeamMapper.toDomain(savedTeam);
    } catch (error) {
      console.error('Error creating team:', error);
      return null;
    }
  }

  async getTeamById(id: string): Promise<Team | null> {
    try {
      const team = await TeamModel.findById(id);
      return TeamMapper.toDomain(team);
    } catch (error) {
      console.error('Error getting team by ID:', error);
      return null;
    }
  }

  async getAllTeams(): Promise<Team[]> {
    try {
      const teams = await TeamModel.find().sort({ name: 1 });
      return TeamMapper.toDomainList(teams);
    } catch (error) {
      console.error('Error getting all teams:', error);
      return [];
    }
  }

  async updateTeam(id: string, teamData: Partial<CreateTeamDTO>): Promise<Team | null> {
    try {
      const updatedTeam = await TeamModel.findByIdAndUpdate(
        id,
        { ...teamData },
        { new: true, runValidators: true }
      );
      
      return TeamMapper.toDomain(updatedTeam);
    } catch (error) {
      console.error('Error updating team:', error);
      return null;
    }
  }

  async deleteTeam(id: string): Promise<boolean> {
    try {
      const result = await TeamModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting team:', error);
      return false;
    }
  }
} 
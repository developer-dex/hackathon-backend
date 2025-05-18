import { Response } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware';
import { CreateTeam } from '../../application/useCases/team/CreateTeam';
import { GetAllTeams } from '../../application/useCases/team/GetAllTeams';
import { GetTeamById } from '../../application/useCases/team/GetTeamById';
import { UpdateTeam } from '../../application/useCases/team/UpdateTeam';
import { DeleteTeam } from '../../application/useCases/team/DeleteTeam';
import { validateTeamRequest } from '../validation/teamValidation';
import { ResponseMapper } from '../../mappers/ResponseMapper';

export class TeamController {
  constructor(
    private createTeamUseCase: CreateTeam,
    private getAllTeamsUseCase: GetAllTeams,
    private getTeamByIdUseCase: GetTeamById,
    private updateTeamUseCase: UpdateTeam,
    private deleteTeamUseCase: DeleteTeam
  ) {}

  async createTeam(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { error, value } = validateTeamRequest(req.body);
      
      if (error) {
        const errorMessage = error.details.map((detail: any) => detail.message).join(', ');
        res.status(400).json(ResponseMapper.validationError(errorMessage));
        return;
      }
      
      const result = await this.createTeamUseCase.execute(value);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(result.statusCode).json(result);
      }
    } catch (error) {
      res.status(500).json(ResponseMapper.serverError(error instanceof Error ? error : undefined));
    }
  }

  async getAllTeams(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const result = await this.getAllTeamsUseCase.execute();
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(result.statusCode).json(result);
      }
    } catch (error) {
      res.status(500).json(ResponseMapper.serverError(error instanceof Error ? error : undefined));
    }
  }

  async getTeamById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const result = await this.getTeamByIdUseCase.execute(id);
      
      if (result.success) {
        res.status(200).json(result);
      } else if (result.message === 'Team not found') {
        res.status(404).json(result);
      } else {
        res.status(result.statusCode).json(result);
      }
    } catch (error) {
      res.status(500).json(ResponseMapper.serverError(error instanceof Error ? error : undefined));
    }
  }

  async updateTeam(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      
      if (req.body.name) {
        const { error } = validateTeamRequest(req.body);
        
        if (error) {
          const errorMessage = error.details.map((detail: any) => detail.message).join(', ');
          res.status(400).json(ResponseMapper.validationError(errorMessage));
          return;
        }
      }
      
      const result = await this.updateTeamUseCase.execute(id, req.body);
      
      if (result.success) {
        res.status(200).json(result);
      } else if (result.message === 'Team not found') {
        res.status(404).json(result);
      } else {
        res.status(result.statusCode).json(result);
      }
    } catch (error) {
      res.status(500).json(ResponseMapper.serverError(error instanceof Error ? error : undefined));
    }
  }

  async deleteTeam(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const result = await this.deleteTeamUseCase.execute(id);
      
      if (result.success) {
        res.status(200).json(result);
      } else if (result.message === 'Team not found') {
        res.status(404).json(result);
      } else {
        res.status(result.statusCode).json(result);
      }
    } catch (error) {
      res.status(500).json(ResponseMapper.serverError(error instanceof Error ? error : undefined));
    }
  }
} 
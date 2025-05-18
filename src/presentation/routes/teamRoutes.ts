import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';
import { CreateTeam } from '../../application/useCases/team/CreateTeam';
import { GetAllTeams } from '../../application/useCases/team/GetAllTeams';
import { GetTeamById } from '../../application/useCases/team/GetTeamById';
import { UpdateTeam } from '../../application/useCases/team/UpdateTeam';
import { DeleteTeam } from '../../application/useCases/team/DeleteTeam';
import { TeamRepositoryImpl } from '../../infrastructure/repositories/TeamRepositoryImpl';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepositoryImpl';

export const teamRouter = Router();

// Initialize repositories
const teamRepository = new TeamRepositoryImpl();
const userRepository = new UserRepositoryImpl();

// Initialize use cases
const createTeamUseCase = new CreateTeam(teamRepository);
const getAllTeamsUseCase = new GetAllTeams(teamRepository);
const getTeamByIdUseCase = new GetTeamById(teamRepository);
const updateTeamUseCase = new UpdateTeam(teamRepository);
const deleteTeamUseCase = new DeleteTeam(teamRepository);

// Initialize controller
const teamController = new TeamController(
  createTeamUseCase,
  getAllTeamsUseCase,
  getTeamByIdUseCase,
  updateTeamUseCase,
  deleteTeamUseCase
);

const authMiddleware = new AuthMiddleware(userRepository);

teamRouter.get(
  '/',
  authMiddleware.verifyToken,
  (req, res) => teamController.getAllTeams(req, res)
);

teamRouter.get(
  '/:id',
  authMiddleware.verifyToken,
  (req, res) => teamController.getTeamById(req, res)
);

teamRouter.post(
  '/',
  authMiddleware.requireTeamLead,
  (req, res) => teamController.createTeam(req, res)
);

teamRouter.put(
  '/:id',
  authMiddleware.requireTeamLead,
  (req, res) => teamController.updateTeam(req, res)
);

teamRouter.delete(
  '/:id',
  authMiddleware.requireTeamLead,
  (req, res) => teamController.deleteTeam(req, res)
); 
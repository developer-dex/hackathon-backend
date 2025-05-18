import { Router } from 'express';
import { KudosController } from '../controllers/KudosController';
import { CreateKudos } from '../../application/useCases/kudos/CreateKudos';
import { GetAllKudos } from '../../application/useCases/kudos/GetAllKudos';
import { KudosRepositoryImpl } from '../../infrastructure/repositories/KudosRepositoryImpl';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepositoryImpl';
import { KudosCategoryRepositoryImpl } from '../../infrastructure/repositories/KudosCategoryRepositoryImpl';
import { TeamRepositoryImpl } from '../../infrastructure/repositories/TeamRepositoryImpl';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { EmailService } from '../../services/email/EmailService';

export const kudosRouter = Router();

// Initialize dependencies
const kudosRepository = new KudosRepositoryImpl();
const userRepository = new UserRepositoryImpl();
const categoryRepository = new KudosCategoryRepositoryImpl();
const teamRepository = new TeamRepositoryImpl();
const createKudosUseCase = new CreateKudos(
  kudosRepository, 
  userRepository, 
  categoryRepository,
  teamRepository
);
const getAllKudosUseCase = new GetAllKudos(kudosRepository);
const kudosController = new KudosController(createKudosUseCase, getAllKudosUseCase);

const authMiddleware = new AuthMiddleware(userRepository);

kudosRouter.post(
  '/', 
  authMiddleware.requireTeamLead,
  (req, res) => kudosController.createKudos(req, res)
);

kudosRouter.get(
  '/',
  authMiddleware.verifyToken,
  (req, res) => kudosController.getAllKudos(req, res)
); 
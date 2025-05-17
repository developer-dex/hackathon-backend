import { Router } from 'express';
import { KudosController } from '../controllers/KudosController';
import { CreateKudos } from '../../application/useCases/kudos/CreateKudos';
import { GetAllKudos } from '../../application/useCases/kudos/GetAllKudos';
import { KudosRepositoryImpl } from '../../infrastructure/repositories/KudosRepositoryImpl';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepositoryImpl';
import { KudosCategoryRepositoryImpl } from '../../infrastructure/repositories/KudosCategoryRepositoryImpl';
import { AuthMiddleware } from '../middlewares/authMiddleware';

export const kudosRouter = Router();

// Initialize dependencies
const kudosRepository = new KudosRepositoryImpl();
const userRepository = new UserRepositoryImpl();
const categoryRepository = new KudosCategoryRepositoryImpl();

const createKudosUseCase = new CreateKudos(kudosRepository, userRepository, categoryRepository);
const getAllKudosUseCase = new GetAllKudos(kudosRepository);
const kudosController = new KudosController(createKudosUseCase, getAllKudosUseCase);

// Create auth middleware
const authMiddleware = new AuthMiddleware(userRepository);

// Define routes
// POST /api/kudos - Create a new kudos (team lead only)
kudosRouter.post(
  '/', 
  authMiddleware.verifyToken,
  authMiddleware.requireTeamLead,
  (req, res) => kudosController.createKudos(req, res)
);

// GET /api/kudos - Get all kudos
kudosRouter.get(
  '/',
  authMiddleware.verifyToken,
  (req, res) => kudosController.getAllKudos(req, res)
); 
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { Login } from '../../application/useCases/auth/Login';
import { Signup } from '../../application/useCases/auth/Signup';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepositoryImpl';
import { TeamRepositoryImpl } from '../../infrastructure/repositories/TeamRepositoryImpl';

export const authRouter = Router();

// Initialize dependencies
const userRepository = new UserRepositoryImpl();
const teamRepository = new TeamRepositoryImpl();
const loginUseCase = new Login(userRepository);
const signupUseCase = new Signup(userRepository, teamRepository);
const authController = new AuthController(loginUseCase, signupUseCase);

// Define routes
authRouter.post('/login', (req, res) => authController.login(req, res));
authRouter.post('/signup', (req, res) => authController.signup(req, res)); 
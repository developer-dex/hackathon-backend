import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { Login } from '../../application/useCases/Login';
import { Signup } from '../../application/useCases/Signup';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepositoryImpl';

export const authRouter = Router();

// Initialize dependencies
const userRepository = new UserRepositoryImpl();
const loginUseCase = new Login(userRepository);
const signupUseCase = new Signup(userRepository);
const authController = new AuthController(loginUseCase, signupUseCase);

// Define routes
authRouter.post('/login', (req, res) => authController.login(req, res));
authRouter.post('/signup', (req, res) => authController.signup(req, res)); 
import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
    
export const authRouter = Router();

const authController = new AuthController();


// Define routes
authRouter.post('/login', (req, res) => authController.login(req, res)); 
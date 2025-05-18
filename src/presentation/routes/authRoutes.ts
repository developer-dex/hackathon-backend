import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { Login } from '../../application/useCases/auth/Login';
import { Signup } from '../../application/useCases/auth/Signup';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepositoryImpl';
import { TeamRepositoryImpl } from '../../infrastructure/repositories/TeamRepositoryImpl';
import { ForgotPasswordController } from '../controllers/ForgotPasswordController';
import { ResetPasswordController } from '../controllers/ResetPasswordController';
import { ForgotPassword } from '../../application/useCases/auth/ForgotPassword';
import { ResetPassword } from '../../application/useCases/auth/ResetPassword';
import { ForgotPasswordRepositoryImpl } from '../../infrastructure/repositories/ForgotPasswordRepositoryImpl';
import { EmailService } from '../../services/email/EmailService';
import { ValidateResetToken } from '../../application/useCases/auth/ValidateResetToken';
import { ValidateResetTokenController } from '../controllers/ValidateResetTokenController';

export const authRouter = Router();

// Initialize dependencies
const userRepository = new UserRepositoryImpl();
const teamRepository = new TeamRepositoryImpl();
const loginUseCase = new Login(userRepository);
const signupUseCase = new Signup(userRepository, teamRepository);
const authController = new AuthController(loginUseCase, signupUseCase);

const emailService = new EmailService();
const forgotPasswordRepository = new ForgotPasswordRepositoryImpl();
const forgotPasswordUseCase = new ForgotPassword(forgotPasswordRepository, userRepository, emailService);
const resetPasswordUseCase = new ResetPassword(forgotPasswordRepository, userRepository);
const forgotPasswordController = new ForgotPasswordController(forgotPasswordUseCase);
const resetPasswordController = new ResetPasswordController(resetPasswordUseCase);
const validateResetTokenUseCase = new ValidateResetToken(forgotPasswordRepository);
const validateResetTokenController = new ValidateResetTokenController(validateResetTokenUseCase);

authRouter.post('/login', (req, res) => authController.login(req, res));
authRouter.post('/signup', (req, res) => authController.signup(req, res));
authRouter.post('/forgot-password', (req, res) => forgotPasswordController.requestPasswordReset(req, res));
authRouter.post('/reset-password', (req, res) => resetPasswordController.resetPassword(req, res));
authRouter.post('/validate-token', (req, res) => validateResetTokenController.validateToken(req, res)); 
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

// Initialize the email service
const emailService = new EmailService();

// Initialize the ForgotPasswordRepository
const forgotPasswordRepository = new ForgotPasswordRepositoryImpl();

// Initialize the ForgotPassword use case with email service
const forgotPasswordUseCase = new ForgotPassword(forgotPasswordRepository, userRepository, emailService);

// Initialize the ResetPassword use case
const resetPasswordUseCase = new ResetPassword(forgotPasswordRepository, userRepository);

// Initialize the ForgotPassword controller
const forgotPasswordController = new ForgotPasswordController(forgotPasswordUseCase);

// Initialize the ResetPassword controller
const resetPasswordController = new ResetPasswordController(resetPasswordUseCase);

// Initialize the ValidateResetToken use case
const validateResetTokenUseCase = new ValidateResetToken(forgotPasswordRepository);

// Initialize the ValidateResetToken controller
const validateResetTokenController = new ValidateResetTokenController(validateResetTokenUseCase);

// Define routes
authRouter.post('/login', (req, res) => authController.login(req, res));
authRouter.post('/signup', (req, res) => authController.signup(req, res));

// Forgot password routes
authRouter.post('/forgot-password', (req, res) => forgotPasswordController.requestPasswordReset(req, res));

// Reset password routes
authRouter.post('/reset-password', (req, res) => resetPasswordController.resetPassword(req, res));

// Validate reset token route
authRouter.post('/validate-token', (req, res) => validateResetTokenController.validateToken(req, res)); 
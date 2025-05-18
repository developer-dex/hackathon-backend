import { Request, Response } from 'express';
import { ForgotPassword } from '../../application/useCases/auth/ForgotPassword';
import { validateForgotPasswordRequest } from '../validation/forgotPasswordValidation';
import { ForgotPasswordRequestDto } from '../../dtos/AuthDto';

/**
 * Controller for handling forgot password requests
 */
export class ForgotPasswordController {
  constructor(private forgotPasswordUseCase: ForgotPassword) {}

  /**
   * Request a password reset
   * @param req Express request
   * @param res Express response
   */
  async requestPasswordReset(req: Request, res: Response): Promise<void> {
    try {
      const forgotPasswordData = req.body as ForgotPasswordRequestDto;

      // Validate request data
      const { error } = validateForgotPasswordRequest(forgotPasswordData);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
        return;
      }

      // Process the forgot password request
      const result = await this.forgotPasswordUseCase.execute(forgotPasswordData);

      // Always return 200 even if user doesn't exist for security
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in forgot password controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'An unexpected error occurred'
      });
    }
  }
} 
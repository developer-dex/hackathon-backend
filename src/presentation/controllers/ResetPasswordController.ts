import { Request, Response } from 'express';
import { ResetPassword } from '../../application/useCases/auth/ResetPassword';
import { validateResetPasswordRequest } from '../validation/forgotPasswordValidation';
import { ResetPasswordRequestDto } from '../../dtos/AuthDto';

/**
 * Controller for handling password reset requests
 */
export class ResetPasswordController {
  constructor(private resetPasswordUseCase: ResetPassword) {}

  /**
   * Reset a user's password with a valid token
   * @param req Express request
   * @param res Express response
   */
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const resetPasswordData = req.body as ResetPasswordRequestDto;

      // Validate request data
      const { error } = validateResetPasswordRequest(resetPasswordData);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
        return;
      }

      // Process the reset password request
      const result = await this.resetPasswordUseCase.execute(resetPasswordData);

      // Return appropriate status based on the result
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(result.error?.includes('Invalid') || result.error?.includes('expired') ? 400 : 500).json(result);
      }
    } catch (error) {
      console.error('Error in reset password controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'An unexpected error occurred'
      });
    }
  }
} 
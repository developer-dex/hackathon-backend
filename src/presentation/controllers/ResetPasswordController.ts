import { Request, Response } from 'express';
import { ResetPassword } from '../../application/useCases/auth/ResetPassword';
import { validateResetPasswordRequest } from '../validation/forgotPasswordValidation';
import { ResetPasswordRequestDto } from '../../dtos/AuthDto';

export class ResetPasswordController {
  constructor(private resetPasswordUseCase: ResetPassword) {}

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const resetPasswordData = req.body as ResetPasswordRequestDto;
      const { error } = validateResetPasswordRequest(resetPasswordData);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
        return;
      }

      const result = await this.resetPasswordUseCase.execute(resetPasswordData);
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
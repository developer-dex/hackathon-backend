import { Request, Response } from 'express';
import { ValidateResetToken } from '../../application/useCases/auth/ValidateResetToken';
import { ValidateTokenRequestDto } from '../../dtos/AuthDto';
import { validateTokenRequest } from '../validation/forgotPasswordValidation';

/**
 * Controller for validating password reset tokens
 */
export class ValidateResetTokenController {
  constructor(private validateResetTokenUseCase: ValidateResetToken) {}

  /**
   * Validate a reset token
   * @param req Express request
   * @param res Express response
   */
  async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const validateTokenData = req.body as ValidateTokenRequestDto;

      // Validate request data using Joi
      const { error } = validateTokenRequest(validateTokenData);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          error: error.details[0].message
        });
        return;
      }

      // Process the token validation request
      const result = await this.validateResetTokenUseCase.execute(validateTokenData);

      // Return result
      res.status(200).json(result);
    } catch (error) {
      console.error('Error in validate token controller:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: 'An unexpected error occurred'
      });
    }
  }
} 
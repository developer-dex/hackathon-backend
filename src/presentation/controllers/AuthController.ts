import { Request, Response } from 'express';
import { Login } from '../../application/useCases/auth/Login';
import { Signup } from '../../application/useCases/auth/Signup';
import { LoginRequestDto } from '../../dtos/AuthDto';
import { SignupRequestDto } from '../../dtos/AuthDto';
import { validateLoginRequest, validateSignupRequest } from '../validation/authValidation';
import { ResponseMapper } from '../../mappers/ResponseMapper';

export class AuthController {
  constructor(
    private loginUseCase: Login,
    private signupUseCase: Signup
  ) {}

  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request data
      const { error, value } = validateLoginRequest(req.body);
      
      if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        const response = ResponseMapper.validationError(errorMessage);
        res.status(response.statusCode).json(response);
        return;
      }
      
      // Execute login use case
      const loginRequest = {
        email: value.email,
        password: value.password
      };
      
      const result = await this.loginUseCase.execute(loginRequest);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(result.statusCode || 401).json(result);
      }
    } catch (error) {
      const response = ResponseMapper.serverError(error instanceof Error ? error : undefined);
      res.status(response.statusCode).json(response);
    }
  }

  async signup(req: Request, res: Response): Promise<void> {
    try {
      // Validate request data
      const { error, value } = validateSignupRequest(req.body);
      
      if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        const response = ResponseMapper.validationError(errorMessage);
        res.status(response.statusCode).json(response);
        return;
      }
      
      // Execute signup use case
      const signupRequest: SignupRequestDto = value;
      
      const result = await this.signupUseCase.execute(signupRequest);
      
      if (result.success) {
        res.status(201).json(result);
      } else {
        // Determine appropriate status code based on error or use the one from the response
        const statusCode = result.statusCode || (result.error?.includes('already registered') ? 409 : 400);
        res.status(statusCode).json(result);
      }
    } catch (error) {
      const response = ResponseMapper.serverError(error instanceof Error ? error : undefined);
      res.status(response.statusCode).json(response);
    }
  }
} 
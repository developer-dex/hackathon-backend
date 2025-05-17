import { Request, Response } from 'express';
import { Login } from '../../application/useCases/Login';
import { LoginRequest } from '../../entities/User';
import { validateLoginRequest } from '../validators/authValidators';
import { ResponseMapper } from '../../mappers/ResponseMapper';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepositoryImpl';

const userRepository = new UserRepositoryImpl();
const loginUseCase = new Login(userRepository);

export class AuthController {
  constructor() { }

  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request data
      const { error, value } = validateLoginRequest(req.body);
      
      if (error) {
        const errorMessage = error.details.map(detail => detail.message).join(', ');
        const response = ResponseMapper.validationError(errorMessage);
        res.status(400).json(response);
        return;
      }
      
      // Execute login use case
      const loginRequest: LoginRequest = {
        email: value.email,
        password: value.password
      };
      
      const result = await loginUseCase.execute(loginRequest);
      
      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(401).json(result);
      }
    } catch (error) {
      const response = ResponseMapper.serverError(error instanceof Error ? error : undefined);
      res.status(500).json(response);
    }
  }
} 
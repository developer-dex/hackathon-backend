import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserDTO } from '../../dtos/UserDto';
import { UserRole } from '../../domain/entities/User';
import { ResponseMapper } from '../../mappers/ResponseMapper';

interface AuthenticatedRequest extends Request {
  user?: UserDTO;
}

export class AuthMiddleware {
  constructor(private userRepository: UserRepository) {}

  authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Get token from the Authorization header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const response = ResponseMapper.unauthorized('Authorization token is required');
        res.status(401).json(response);
        return;
      }
      
      const token = authHeader.split(' ')[1];
      
      // Verify token
      const user = await this.userRepository.verifyToken(token);
      
      if (!user) {
        const response = ResponseMapper.unauthorized('Invalid or expired token');
        res.status(401).json(response);
        return;
      }
      
      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      const response = ResponseMapper.serverError(error instanceof Error ? error : undefined);
      res.status(500).json(response);
    }
  };

  // Middleware to check if user is a Team Lead
  authorizeTeamLead = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const response = ResponseMapper.unauthorized('User not authenticated');
      res.status(401).json(response);
      return;
    }

    if (req.user.role !== UserRole.TEAM_LEAD) {
      const response = ResponseMapper.forbidden('This action requires Team Lead privileges');
      res.status(403).json(response);
      return;
    }

    next();
  };
} 
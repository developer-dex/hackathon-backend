import { Request, Response, NextFunction } from 'express';
import { UserDTO } from '../../dtos/AuthDto';
import { IUserRepository } from '../../domain/interfaces/repositories/IUserRepository';
import { ResponseMapper } from '../../mappers/ResponseMapper';
import jwt from 'jsonwebtoken';
import { EUserRole } from '../../domain/entities/User';

// Extend the Request interface to include the user property
export interface AuthenticatedRequest extends Request {
  user?: UserDTO;
}

export class AuthMiddleware {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
    // Bind methods to ensure 'this' context is preserved
    this.verifyToken = this.verifyToken.bind(this);
    this.requireTeamLead = this.requireTeamLead.bind(this);
  }

  /**
   * Express middleware to verify JWT token from Authorization header
   */
  verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json(ResponseMapper.error('Unauthorized: No token provided', 'Authorization header must be provided with Bearer token'));
        return;
      }

      const token = authHeader.split(' ')[1];
      
      if (!token) {
        res.status(401).json(ResponseMapper.error('Unauthorized: Invalid token format', 'Token must be provided in the format "Bearer token"'));
        return;
      }

      // Verify token with user repository
      const user = await this.userRepository.verifyToken(token);
      
      if (!user) {
        res.status(401).json(ResponseMapper.error('Unauthorized: Invalid token', 'Token is invalid or expired'));
        return;
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(500).json(ResponseMapper.error('Server error', 'An error occurred during authentication'));
    }
  };

  /**
   * Express middleware to enforce team lead role
   */
  requireTeamLead = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(ResponseMapper.error('Unauthorized', 'User not authenticated'));
      return;
    }

    if (req.user.role !== EUserRole.TEAM_LEAD) {
      res.status(403).json(ResponseMapper.error('Forbidden', 'This action requires team lead privileges'));
      return;
    }

    next();
  };
} 
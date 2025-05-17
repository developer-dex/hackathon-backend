import { Router } from 'express';
import { AnalyticsController } from '../controllers/AnalyticsController';
import { GetAnalytics } from '../../application/useCases/analytics/GetAnalytics';
import { AnalyticsRepositoryImpl } from '../../infrastructure/repositories/AnalyticsRepositoryImpl';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepositoryImpl';

export const analyticsRouter = Router();

// Initialize dependencies
const analyticsRepository = new AnalyticsRepositoryImpl();
const getAnalyticsUseCase = new GetAnalytics(analyticsRepository);
const analyticsController = new AnalyticsController(getAnalyticsUseCase);

// Create auth middleware
const userRepository = new UserRepositoryImpl();
const authMiddleware = new AuthMiddleware(userRepository);

// Define routes
// GET /api/analytics - Get analytics data
analyticsRouter.get(
  '/',
  authMiddleware.verifyToken,
  (req, res) => analyticsController.getAnalytics(req, res)
); 
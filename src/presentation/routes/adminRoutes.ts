import express from 'express';
import { AdminController } from '../controllers/AdminController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { GetAllUsers } from '../../application/useCases/admin/GetAllUsers';
import { UpdateUserVerificationStatus } from '../../application/useCases/admin/UpdateUserVerificationStatus';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepositoryImpl';

const router = express.Router();
const userRepository = new UserRepositoryImpl();
const getAllUsersUseCase = new GetAllUsers(userRepository);
const updateUserVerificationStatusUseCase = new UpdateUserVerificationStatus(userRepository);
const adminController = new AdminController(
  getAllUsersUseCase, 
  updateUserVerificationStatusUseCase
);
const authMiddleware = new AuthMiddleware(userRepository);

// Route to get all users with optional role filter
// GET /api/admin/users?role=ADMIN&limit=10&offset=0
router.get('/users', authMiddleware.requireAdminAndTeamLead, 
    (req, res) => adminController.getAllUsers(req, res));

// Route to update user verification status
// PATCH /api/admin/users/:userId/verification-status
router.patch(
  '/users/:userId/verification-status', 
  authMiddleware.requireAdminAndTeamLead, 
  (req, res) => adminController.updateUserStatus(req, res));

export default router; 
import express from 'express';
import { AdminController } from '../controllers/AdminController';
import { AuthMiddleware } from '../middlewares/authMiddleware';
import { GetAllUsers } from '../../application/useCases/admin/GetAllUsers';
import { UpdateUserVerificationStatus } from '../../application/useCases/admin/UpdateUserVerificationStatus';
import { UserRepositoryImpl } from '../../infrastructure/repositories/UserRepositoryImpl';
import { ToggleUserActiveStatus } from '../../application/useCases/user/ToggleUserActiveStatus';
import { ChangeUserRole } from '../../application/useCases/admin/ChangeUserRole';
import { ChangeUserTeam } from '../../application/useCases/admin/ChangeUserTeam';
import { Request, Response } from 'express';

const router = express.Router();
const userRepository = new UserRepositoryImpl();
const getAllUsersUseCase = new GetAllUsers(userRepository);
const updateUserVerificationStatusUseCase = new UpdateUserVerificationStatus(userRepository);
const toggleUserActiveStatusUseCase = new ToggleUserActiveStatus(userRepository);
const changeUserRoleUseCase = new ChangeUserRole(userRepository);
const changeUserTeamUseCase = new ChangeUserTeam(userRepository);
const adminController = new AdminController(
  getAllUsersUseCase, 
  updateUserVerificationStatusUseCase,
  toggleUserActiveStatusUseCase,
  changeUserRoleUseCase,
  changeUserTeamUseCase
);
const authMiddleware = new AuthMiddleware(userRepository);


router.get('/users', authMiddleware.verifyToken, 
    (req, res) => adminController.getAllUsers(req, res));


router.patch(
  "/users/:userId/verification-status",
  authMiddleware.requireAdmin,
  (req, res) => adminController.updateUserStatus(req, res)
);

router.post(
  '/users/toggle-status',
  authMiddleware.requireAdmin,
  (req: Request, res: Response) => adminController.toggleUserActiveStatus(req, res)
);

router.patch(
  '/users/change-role',
  authMiddleware.requireAdmin,
  (req: Request, res: Response) => adminController.changeUserRole(req, res)
);

router.patch(
  '/users/change-team',
  authMiddleware.requireAdmin,
  (req: Request, res: Response) => adminController.changeUserTeam(req, res)
);

export default router;

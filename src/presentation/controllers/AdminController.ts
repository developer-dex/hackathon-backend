import { Request, Response } from 'express';
import { GetAllUsers } from '../../application/useCases/admin/GetAllUsers';
import { UpdateUserVerificationStatus } from '../../application/useCases/admin/UpdateUserVerificationStatus';
import { AdminMapper } from '../../mappers/AdminMapper';
import { ResponseMapper } from '../../mappers/ResponseMapper';
import { validateUpdateStatusRequest } from '../validation/userValidation';
import { pagination } from '../../shared/utils/utils';

export class AdminController {
  constructor(
    private getAllUsersUseCase: GetAllUsers,
    private updateUserVerificationStatusUseCase: UpdateUserVerificationStatus
  ) {}

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const { role } = req.query;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 0;
      const skip = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;

      const { offset, size } = pagination(limit, skip);
      
      const roleFilter = role ? String(role) : undefined;
      
      const { users, totalCount } = await this.getAllUsersUseCase.execute(
        roleFilter,
        limit,
        offset
      );
      
      const userDTOs = AdminMapper.toUserListItemDTOList(users);
      
      const paginationMeta = {
        total: totalCount,
        offset,
        limit: limit || totalCount // Default to total count if limit is undefined
      };
      
      const response = ResponseMapper.success(
        {
          users: userDTOs
        },
        'Users retrieved successfully',
        paginationMeta
      );
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in AdminController.getAllUsers:', error);
      const response = ResponseMapper.error('Failed to retrieve users');
      res.status(500).json(response);
    }
  }

  async updateUserStatus(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const { status } = req.body;
      
      // Validate request data
      const { error } = validateUpdateStatusRequest({ status });
      if (error) {
        const response = ResponseMapper.validationError(error.details[0].message);
        res.status(400).json(response);
        return;
      }
      
      // Update user status
      const updatedUser = await this.updateUserVerificationStatusUseCase.execute(userId, status);
      
      if (!updatedUser) {
        const response = ResponseMapper.notFound('User not found');
        res.status(404).json(response);
        return;
      }
      
      // Convert to DTO
      const userDTO = AdminMapper.toUserListItemDTO(updatedUser);
      
      const response = ResponseMapper.success(
        { user: userDTO },
        'User verification status updated successfully'
      );
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error in AdminController.updateUserStatus:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const response = ResponseMapper.error('Failed to update user status', errorMessage);
      res.status(500).json(response);
    }
  }
} 
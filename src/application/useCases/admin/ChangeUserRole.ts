import { ApiResponseDto } from "../../../dtos/ApiResponseDto";
import { UserDTO } from "../../../dtos/AuthDto";
import { IUserRepository } from "../../../domain/interfaces/repositories/UserRepository";
import { ResponseMapper } from "../../../mappers/ResponseMapper";
import { UserMapper } from "../../../mappers/UserMapper";
import { EUserRole } from "../../../domain/entities/User";

export interface ChangeUserRoleRequestDto {
  userId: string;
  role: string;
}

export interface ChangeUserRoleResponseDto {
  success: boolean;
  user: UserDTO;
  message: string;
}

export class ChangeUserRole {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    requestDto: ChangeUserRoleRequestDto
  ): Promise<ApiResponseDto<ChangeUserRoleResponseDto>> {
    try {
      const { userId, role } = requestDto;

      // Validate the role
      if (!Object.values(EUserRole).includes(role as EUserRole)) {
        return ResponseMapper.badRequest(`Invalid role: ${role}. Valid roles are: ${Object.values(EUserRole).join(', ')}`);
      }

      // Check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return ResponseMapper.notFound("User not found");
      }

      // If the user already has the specified role, return early
      if (user.getRole() === role) {
        return ResponseMapper.success(
          {
            success: true,
            user: UserMapper.toDTO(user),
            message: `User already has the role ${role}`
          },
          `User already has the role ${role}`
        );
      }

      // Update the user's role
      const userDto = UserMapper.toDTO(user);
      const updatedData = {
        ...userDto,
        role: role as EUserRole
      };

      const updatedUser = await this.userRepository.updateUser(userId, updatedData);
      
      if (!updatedUser) {
        return ResponseMapper.serverError(
          new Error(`Failed to update user role to ${role}`)
        );
      }

      // Return success response
      return ResponseMapper.success(
        {
          success: true,
          user: UserMapper.toDTO(updatedUser),
          message: `User role changed to ${role} successfully`
        },
        `User role changed to ${role} successfully`
      );
    } catch (error) {
      return ResponseMapper.serverError(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }
} 
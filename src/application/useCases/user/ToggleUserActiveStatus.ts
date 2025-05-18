import { ApiResponseDto } from "../../../dtos/ApiResponseDto";
import { UserDTO } from "../../../dtos/AuthDto";
import { IUserRepository } from "../../../domain/interfaces/repositories/UserRepository";
import { ResponseMapper } from "../../../mappers/ResponseMapper";
import { UserMapper } from "../../../mappers/UserMapper";

export interface ToggleUserStatusRequestDto {
  userId: string;
  isActive: boolean;
}

export interface ToggleUserStatusResponseDto {
  success: boolean;
  user: UserDTO;
  message: string;
}

export class ToggleUserActiveStatus {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    requestDto: ToggleUserStatusRequestDto
  ): Promise<ApiResponseDto<ToggleUserStatusResponseDto>> {
    try {
      const { userId, isActive } = requestDto;

      console.log(userId, isActive);
      // Check if user exists
      const user = await this.userRepository.findById(userId);
      console.log(user);
      if (!user) {
        return ResponseMapper.notFound("User not found");
      }

      // If user is already in the desired state, return success without making changes
      if (user.isActive() === isActive) {
        const message = isActive
          ? "User is already active"
          : "User is already inactive";
        
        return ResponseMapper.success(
          {
            success: true,
            user: UserMapper.toDTO(user),
            message
          },
          message
        );
      }

      // Toggle user's active status
      const updatedUser = await this.userRepository.toggleUserActiveStatus(userId, isActive);
      
      if (!updatedUser) {
        return ResponseMapper.serverError(
          new Error(`Failed to ${isActive ? 'activate' : 'deactivate'} user`)
        );
      }

      // Create success message
      const message = isActive
        ? "User activated successfully"
        : "User deactivated successfully";

      // Convert to DTO and return success response
      return ResponseMapper.success(
        {
          success: true,
          user: UserMapper.toDTO(updatedUser),
          message
        },
        message
      );
    } catch (error) {
      return ResponseMapper.serverError(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }
} 
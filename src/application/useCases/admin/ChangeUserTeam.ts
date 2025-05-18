import { ApiResponseDto } from "../../../dtos/ApiResponseDto";
import { UserDTO } from "../../../dtos/AuthDto";
import { IUserRepository } from "../../../domain/interfaces/repositories/UserRepository";
import { ResponseMapper } from "../../../mappers/ResponseMapper";
import { UserMapper } from "../../../mappers/UserMapper";
import mongoose from "mongoose";

export interface ChangeUserTeamRequestDto {
  userId: string;
  teamId: string;
}

export interface ChangeUserTeamResponseDto {
  success: boolean;
  user: UserDTO;
  message: string;
}

export class ChangeUserTeam {
  constructor(private userRepository: IUserRepository) {}

  async execute(
    requestDto: ChangeUserTeamRequestDto
  ): Promise<ApiResponseDto<ChangeUserTeamResponseDto>> {
    try {
      const { userId, teamId } = requestDto;

      // Validate MongoDB ObjectId format
      if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return ResponseMapper.badRequest(`Invalid teamId format: ${teamId}`);
      }

      // Check if user exists
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return ResponseMapper.notFound("User not found");
      }

      // If the user already has the specified team, return early
      if (user.getTeamId()?.toString() === teamId) {
        return ResponseMapper.success(
          {
            success: true,
            user: UserMapper.toDTO(user),
            message: `User already belongs to this team`
          },
          `User already belongs to this team`
        );
      }

      // Update the user's team
      const userDto = UserMapper.toDTO(user);
      const updatedData = {
        ...userDto,
        teamId
      };

      const updatedUser = await this.userRepository.updateUser(userId, updatedData);
      
      if (!updatedUser) {
        return ResponseMapper.serverError(
          new Error(`Failed to update user team`)
        );
      }

      // Return success response
      return ResponseMapper.success(
        {
          success: true,
          user: UserMapper.toDTO(updatedUser),
          message: `User team updated successfully`
        },
        `User team updated successfully`
      );
    } catch (error) {
      return ResponseMapper.serverError(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }
} 
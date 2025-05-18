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

      if (!mongoose.Types.ObjectId.isValid(teamId)) {
        return ResponseMapper.badRequest(`Invalid teamId format: ${teamId}`);
      }

      const userExist = await this.userRepository.findById(userId);
      if (!userExist) {
        return ResponseMapper.notFound("User not found");
      }

      if (userExist.getTeamId()?.toString() === teamId) {
        return ResponseMapper.success(
          {
            success: true,
            user: UserMapper.toDTO(userExist),
            message: `User already belongs to this team`
          },
          `User already belongs to this team`
        );
      }

      const userDto = UserMapper.toDTO(userExist);
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
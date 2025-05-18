import { ApiResponseDto } from "../../../dtos/ApiResponseDto";
import { ResetPasswordRequestDto, ResetPasswordResponseDto } from "../../../dtos/AuthDto";
import { IForgotPasswordRepository } from "../../../domain/interfaces/repositories/ForgotPasswordRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/UserRepository";
import { ResponseMapper } from "../../../mappers/ResponseMapper";
import { UserMapper } from "../../../mappers/UserMapper";

export class ResetPassword {
  constructor(
    private forgotPasswordRepository: IForgotPasswordRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(
    requestDto: ResetPasswordRequestDto
  ): Promise<ApiResponseDto<ResetPasswordResponseDto>> {
    try {
      const { token, newPassword } = requestDto;

      const resetToken = await this.forgotPasswordRepository.findByToken(token);

      if (!resetToken) {
        return ResponseMapper.badRequest("Invalid or expired password reset token");
      }

      const now = new Date();
      if (resetToken.getExpiresAt() < now) {
        return ResponseMapper.badRequest("Password reset token has expired");
      }

      if (resetToken.getIsUsed()) {
        return ResponseMapper.badRequest("Password reset token has already been used");
      }

      const user = await this.userRepository.findByIdWithoutDeleteUser(resetToken.getUserId());
      if (!user) {
        return ResponseMapper.badRequest("User not found");
      }

      const updatedUser = await this.userRepository.updatePassword(user.getId(), newPassword);
      if (!updatedUser) {
        return ResponseMapper.serverError(new Error("Failed to update user password"));
      }

      await this.forgotPasswordRepository.markAsUsed(token);

      return ResponseMapper.success(
        {
          success: true,
          message: "Password has been successfully reset"
        },
        "Password reset successful"
      );
    } catch (error) {
      return ResponseMapper.serverError(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }
} 
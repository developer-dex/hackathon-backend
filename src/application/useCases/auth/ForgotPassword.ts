import { ApiResponseDto } from "../../../dtos/ApiResponseDto";
import { ForgotPasswordRequestDto, ForgotPasswordResponseDto } from "../../../dtos/AuthDto";
import { IForgotPasswordRepository } from "../../../domain/interfaces/repositories/ForgotPasswordRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/UserRepository";
import { ResponseMapper } from "../../../mappers/ResponseMapper";
import { config } from "../../../config/config";
import { EmailService } from "../../../services/email/EmailService";

export class ForgotPassword {
  constructor(
    private forgotPasswordRepository: IForgotPasswordRepository,
    private userRepository: IUserRepository,
    private emailService: EmailService
  ) {}

  async execute(
    requestDto: ForgotPasswordRequestDto
  ): Promise<ApiResponseDto<ForgotPasswordResponseDto>> {
    try {
      const { email } = requestDto;

      const userExist = await this.userRepository.findByEmail(email);
      
      if (!userExist) {
        return ResponseMapper.success(
          { 
            success: true,
            message: "If your email is registered, you will receive a password reset link."
          },
          "Password reset instructions sent"
        );
      }

      await this.forgotPasswordRepository.deleteExpiredTokens(userExist.getId());

      const resetToken = await this.forgotPasswordRepository.createPasswordResetToken(
        email,
        userExist.getId()
      );

      if (!resetToken) {
        return ResponseMapper.serverError(
          new Error("Failed to create password reset token")
        );
      }

      const resetLink = `${config.frontendBaseUrl}${config.resetPasswordPath}?token=${resetToken.getToken()}`;

      await this.emailService.sendResetPasswordEmail(email, resetLink);

      const isDevelopment = process.env.NODE_ENV !== "production";

      return ResponseMapper.success(
        {
          success: true,
          message: "Password reset instructions sent to your email",
          ...(isDevelopment && { resetLink })
        },
        "Password reset instructions sent"
      );
    } catch (error) {
      return ResponseMapper.serverError(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }
} 
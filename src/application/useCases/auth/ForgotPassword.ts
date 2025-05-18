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

      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      
      // If user not found, still return success for security reasons
      // but don't actually create a token
      if (!user) {
        return ResponseMapper.success(
          { 
            success: true,
            message: "If your email is registered, you will receive a password reset link."
          },
          "Password reset instructions sent"
        );
      }

      // Clean up expired tokens first
      await this.forgotPasswordRepository.deleteExpiredTokens();

      // Create password reset token
      const resetToken = await this.forgotPasswordRepository.createPasswordResetToken(
        email,
        user.getId()
      );

      if (!resetToken) {
        return ResponseMapper.serverError(
          new Error("Failed to create password reset token")
        );
      }

      // Generate reset link
      const resetLink = `${config.frontendBaseUrl}${config.resetPasswordPath}?token=${resetToken.getToken()}`;

      // Send the password reset email
      await this.emailService.sendResetPasswordEmail(email, resetLink);

      // In development, also return the reset link
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
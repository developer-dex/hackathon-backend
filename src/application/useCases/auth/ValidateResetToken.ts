import { ApiResponseDto } from "../../../dtos/ApiResponseDto";
import { ValidateTokenRequestDto, ValidateTokenResponseDto } from "../../../dtos/AuthDto";
import { IForgotPasswordRepository } from "../../../domain/interfaces/repositories/ForgotPasswordRepository";
import { ResponseMapper } from "../../../mappers/ResponseMapper";

export class ValidateResetToken {
  constructor(private forgotPasswordRepository: IForgotPasswordRepository) {}

  async execute(
    requestDto: ValidateTokenRequestDto
  ): Promise<ApiResponseDto<ValidateTokenResponseDto>> {
    try {
      const { token } = requestDto;

      const resetToken = await this.forgotPasswordRepository.findByToken(token);

      if (!resetToken) {
        return ResponseMapper.success(
          {
            isValid: false,
            message: "Invalid or expired token"
          },
          "Token validation"
        );
      }

      const now = new Date();
      if (resetToken.getExpiresAt() < now) {
        return ResponseMapper.success(
          {
            isValid: false,
            message: "Token has expired"
          },
          "Token validation"
        );
      }

      if (resetToken.getIsUsed()) {
        return ResponseMapper.success(
          {
            isValid: false,
            message: "Token has already been used"
          },
          "Token validation"
        );
      }

      return ResponseMapper.success(
        {
          isValid: true,
          message: "Token is valid",
          email: resetToken.getEmail(),
          expiresAt: resetToken.getExpiresAt()
        },
        "Token validation"
      );
    } catch (error) {
      return ResponseMapper.serverError(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }
} 
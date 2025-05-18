import { EUserRole, VerificationStatus } from '../domain/entities/User';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: EUserRole;
  teamId?: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  user: UserDTO;
  token: string;
} 

export interface SignupRequestDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: EUserRole;
  teamId: string;
}

export interface SignupResponseDto {
  id: string;
  name: string;
  email: string;
  role: EUserRole;
  team: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Data transfer object for forgot password requests
 */
export interface ForgotPasswordRequestDto {
  /**
   * The email address of the user requesting password reset
   */
  email: string;
}

/**
 * Data transfer object for forgot password responses
 */
export interface ForgotPasswordResponseDto {
  /**
   * Whether the operation was successful
   */
  success: boolean;

  /**
   * A message to display to the user
   */
  message: string;

  /**
   * The reset link (only returned in development)
   */
  resetLink?: string;
}

export interface ForgotPasswordDto {
  id: string;
  userId: string;
  email: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Data transfer object for reset password requests
 */
export interface ResetPasswordRequestDto {
  /**
   * The password reset token
   */
  token: string;

  /**
   * The new password
   */
  newPassword: string;
}

/**
 * Data transfer object for reset password responses
 */
export interface ResetPasswordResponseDto {
  /**
   * Whether the operation was successful
   */
  success: boolean;

  /**
   * A message to display to the user
   */
  message: string;
}

/**
 * Data transfer object for token validation requests
 */
export interface ValidateTokenRequestDto {
  /**
   * The token to validate
   */
  token: string;
}

/**
 * Data transfer object for token validation responses
 */
export interface ValidateTokenResponseDto {
  /**
   * Whether the token is valid
   */
  isValid: boolean;

  /**
   * A message about the token validation
   */
  message: string;

  /**
   * The email associated with the token (only if valid)
   */
  email?: string;

  /**
   * When the token expires (only if valid)
   */
  expiresAt?: Date;
}

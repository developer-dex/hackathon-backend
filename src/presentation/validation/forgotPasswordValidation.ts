import Joi from 'joi';
import { ForgotPasswordRequestDto, ResetPasswordRequestDto, ValidateTokenRequestDto } from '../../dtos/AuthDto';

/**
 * Validation schema for forgot password requests
 */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .trim()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    })
});

/**
 * Validation schema for reset password requests
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': 'Token is required',
      'any.required': 'Token is required'
    }),
  newPassword: Joi.string()
    .required()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'New password is required'
    })
});

/**
 * Validation schema for token validation requests
 */
export const validateTokenSchema = Joi.object({
  token: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': 'Token is required',
      'any.required': 'Token is required'
    })
});

/**
 * Validate a forgot password request
 * @param data The request data to validate
 * @returns The validation result
 */
export const validateForgotPasswordRequest = (data: ForgotPasswordRequestDto) => {
  return forgotPasswordSchema.validate(data, { abortEarly: true });
};

/**
 * Validate a reset password request
 * @param data The request data to validate
 * @returns The validation result
 */
export const validateResetPasswordRequest = (data: ResetPasswordRequestDto) => {
  return resetPasswordSchema.validate(data, { abortEarly: true });
};

/**
 * Validate a token validation request
 * @param data The request data to validate
 * @returns The validation result
 */
export const validateTokenRequest = (data: ValidateTokenRequestDto) => {
  return validateTokenSchema.validate(data, { abortEarly: true });
}; 
import Joi from 'joi';
import { VerificationStatus, EUserRole } from '../../domain/entities/User';
import { ToggleUserStatusRequestDto } from '../../application/useCases/user/ToggleUserActiveStatus';
import { ChangeUserRoleRequestDto } from '../../application/useCases/admin/ChangeUserRole';
import { ChangeUserTeamRequestDto } from '../../application/useCases/admin/ChangeUserTeam';

export const validateUpdateStatusRequest = (data: { status: string }) => {
  const schema = Joi.object({
    status: Joi.string()
      .valid(...Object.values(VerificationStatus))
      .required()
      .messages({
        'any.required': 'Verification status is required',
        'string.empty': 'Verification status cannot be empty',
        'any.only': `Status must be one of: ${Object.values(VerificationStatus).join(', ')}`
      })
  });

  return schema.validate(data, { abortEarly: false });
};

/**
 * Validation schema for toggle user active status requests
 */
export const toggleUserActiveStatusSchema = Joi.object({
  userId: Joi.string()
    .required()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.empty': 'User ID is required',
      'string.pattern.base': 'User ID must be a valid MongoDB ObjectId',
      'any.required': 'User ID is required'
    }),
  isActive: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'isActive must be a boolean',
      'any.required': 'isActive is required'
    })
});

/**
 * Validate a toggle user active status request
 * @param data The request data to validate
 * @returns The validation result
 */
export const validateToggleUserActiveStatusRequest = (data: ToggleUserStatusRequestDto) => {
  return toggleUserActiveStatusSchema.validate(data, { abortEarly: true });
};

/**
 * Validation schema for changing user role
 */
export const changeUserRoleSchema = Joi.object({
  userId: Joi.string()
    .required()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.empty': 'User ID is required',
      'string.pattern.base': 'User ID must be a valid MongoDB ObjectId',
      'any.required': 'User ID is required'
    }),
  role: Joi.string()
    .required()
    .valid(...Object.values(EUserRole))
    .messages({
      'string.empty': 'Role is required',
      'any.only': `Role must be one of: ${Object.values(EUserRole).join(', ')}`,
      'any.required': 'Role is required'
    })
});

/**
 * Validate a change user role request
 * @param data The request data to validate
 * @returns The validation result
 */
export const validateChangeUserRoleRequest = (data: ChangeUserRoleRequestDto) => {
  return changeUserRoleSchema.validate(data, { abortEarly: true });
};

/**
 * Validation schema for changing user team
 */
export const changeUserTeamSchema = Joi.object({
  userId: Joi.string()
    .required()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.empty': 'User ID is required',
      'string.pattern.base': 'User ID must be a valid MongoDB ObjectId',
      'any.required': 'User ID is required'
    }),
  teamId: Joi.string()
    .required()
    .trim()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.empty': 'Team ID is required',
      'string.pattern.base': 'Team ID must be a valid MongoDB ObjectId',
      'any.required': 'Team ID is required'
    })
});

/**
 * Validate a change user team request
 * @param data The request data to validate
 * @returns The validation result
 */
export const validateChangeUserTeamRequest = (data: ChangeUserTeamRequestDto) => {
  return changeUserTeamSchema.validate(data, { abortEarly: true });
}; 
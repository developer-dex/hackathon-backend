import Joi from 'joi';
import { LoginRequestDto } from '../../dtos/AuthDto';
import { SignupRequestDto } from '../../dtos/AuthDto';
import { EUserRole } from '../../domain/entities/User';

export const validateLoginRequest = (data: LoginRequestDto) => {
  const schema = Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Email must be a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
      }),
      
    password: Joi.string()
      .required()
      .min(6)
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
      })
  });

  return schema.validate(data, { abortEarly: false });
};

export const validateSignupRequest = (data: SignupRequestDto) => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .trim()
      .min(2)
      .max(100)
      .messages({
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 100 characters',
        'any.required': 'Name is required'
      }),
      
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Email must be a valid email address',
        'string.empty': 'Email is required',
        'any.required': 'Email is required'
      }),
      
    password: Joi.string()
      .required()
      .min(6)
      .messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
      }),
      
    confirmPassword: Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'string.empty': 'Confirm password is required',
        'any.only': 'Passwords must match',
        'any.required': 'Confirm password is required'
      }),
      
    role: Joi.string()
      .valid(...Object.values(EUserRole))
      .required()
      .messages({
        'string.empty': 'Role is required',
        'any.only': 'Role must be one of the valid roles',
        'any.required': 'Role is required'
      }),
      
    department: Joi.string()
      .required()
      .trim()
      .messages({
        'string.empty': 'Department is required',
        'any.required': 'Department is required'
      })
  });

  return schema.validate(data, { abortEarly: false });
}; 
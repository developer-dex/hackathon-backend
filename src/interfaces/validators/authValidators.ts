import Joi from 'joi';
import { LoginRequest } from '../../entities/User';

export const validateLoginRequest = (data: LoginRequest) => {
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
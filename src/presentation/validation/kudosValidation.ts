import Joi from 'joi';
import { CreateKudosDTO } from '../../dtos/KudosDto';

export const validateKudosRequest = (data: CreateKudosDTO) => {
  const schema = Joi.object({
    senderId: Joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.empty': 'Sender ID is required',
        'string.pattern.base': 'Sender ID must be a valid MongoDB ObjectId',
        'any.required': 'Sender ID is required'
      }),
      
    receiverId: Joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.empty': 'Receiver ID is required',
        'string.pattern.base': 'Receiver ID must be a valid MongoDB ObjectId',
        'any.required': 'Receiver ID is required'
      }),
      
    categoryId: Joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .messages({
        'string.empty': 'Category ID is required',
        'string.pattern.base': 'Category ID must be a valid MongoDB ObjectId',
        'any.required': 'Category ID is required'
      }),
      
    message: Joi.string()
      .required()
      .trim()
      .min(5)
      .max(500)
      .messages({
        'string.empty': 'Message is required',
        'string.min': 'Message must be at least 5 characters long',
        'string.max': 'Message cannot exceed 500 characters',
        'any.required': 'Message is required'
      }),

    teamName: Joi.string()
      .required()
      .trim()
      .min(2)
      .max(100)
      .messages({
        'string.empty': 'Team name is required',
        'string.min': 'Team name must be at least 2 characters long',
        'string.max': 'Team name cannot exceed 100 characters',
        'any.required': 'Team name is required'
      })
  });

  return schema.validate(data, { abortEarly: false });
}; 
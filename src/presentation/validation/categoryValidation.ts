import Joi from 'joi';
import { CreateKudosCategoryDTO } from '../../dtos/KudosCategoryDto';

export const validateCategoryRequest = (data: CreateKudosCategoryDTO) => {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .trim()
      .min(2)
      .max(50)
      .messages({
        'string.empty': 'Category name is required',
        'string.min': 'Category name must be at least 2 characters long',
        'string.max': 'Category name cannot exceed 50 characters',
        'any.required': 'Category name is required'
      }),
      
    description: Joi.string()
      .required()
      .trim()
      .min(5)
      .max(200)
      .messages({
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 5 characters long',
        'string.max': 'Description cannot exceed 200 characters',
        'any.required': 'Description is required'
      }),
      
    icon: Joi.string()
      .required()
      .trim()
      .messages({
        'string.empty': 'Icon is required',
        'any.required': 'Icon is required'
      }),
      
    color: Joi.string()
      .required()
      .trim()
      .pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
      .messages({
        'string.empty': 'Color is required',
        'string.pattern.base': 'Color must be a valid hex color code (e.g., #3498db)',
        'any.required': 'Color is required'
      })
  });

  return schema.validate(data, { abortEarly: false });
}; 
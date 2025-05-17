import Joi from 'joi';
import { CreateTeamDTO } from '../../dtos/TeamDto';

export const validateTeamRequest = (data: CreateTeamDTO) => {
  const schema = Joi.object({
    name: Joi.string()
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
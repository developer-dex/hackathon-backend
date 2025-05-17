import Joi from 'joi';
import { VerificationStatus } from '../../domain/entities/User';

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
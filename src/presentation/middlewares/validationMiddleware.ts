import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void | Response => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(error => {
        // Handle different error formats
        const fieldName = 'param' in error ? error.param : 
                          'path' in error ? error.path : 
                          'field';
        
        return {
          field: fieldName,
          message: error.msg
        };
      })
    });
  }
  
  next();
}; 
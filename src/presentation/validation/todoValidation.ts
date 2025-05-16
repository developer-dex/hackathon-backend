import { body, param } from 'express-validator';

export const createTodoValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean')
];

export const updateTodoValidation = [
  param('id')
    .notEmpty()
    .withMessage('Todo ID is required')
    .isString()
    .withMessage('Todo ID must be a string'),
  
  body('title')
    .optional()
    .isString()
    .withMessage('Title must be a string')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string')
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean')
];

export const idValidation = [
  param('id')
    .notEmpty()
    .withMessage('Todo ID is required')
    .isString()
    .withMessage('Todo ID must be a string')
]; 
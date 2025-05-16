import { Router } from 'express';
import { TodoController } from '../controllers/TodoController';
import { validateRequest } from '../middlewares/validationMiddleware';
import { createTodoValidation, updateTodoValidation, idValidation } from '../validation/todoValidation';

const router = Router();
const todoController = new TodoController();

// Create a new todo
router.post(
  '/',
  createTodoValidation,
  validateRequest,
  todoController.createTodo.bind(todoController)
);

// Get all todos
router.get(
  '/',
  todoController.getAllTodos.bind(todoController)
);

// Get a todo by ID
router.get(
  '/:id',
  idValidation,
  validateRequest,
  todoController.getTodoById.bind(todoController)
);

// Update a todo
router.put(
  '/:id',
  updateTodoValidation,
  validateRequest,
  todoController.updateTodo.bind(todoController)
);

// Delete a todo
router.delete(
  '/:id',
  idValidation,
  validateRequest,
  todoController.deleteTodo.bind(todoController)
);

export default router; 
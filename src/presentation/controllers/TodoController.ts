import { Request, Response } from 'express';
import { CreateTodo } from '../../application/useCases/CreateTodo';
import { GetAllTodos } from '../../application/useCases/GetAllTodos';
import { GetTodoById } from '../../application/useCases/GetTodoById';
import { UpdateTodo } from '../../application/useCases/UpdateTodo';
import { DeleteTodo } from '../../application/useCases/DeleteTodo';
import { TodoRepositoryImpl } from '../../infrastructure/repositories/TodoRepositoryImpl';

// Initialize repositories
const todoRepository = new TodoRepositoryImpl();

// Initialize use cases
const createTodoUseCase = new CreateTodo(todoRepository);
const getAllTodosUseCase = new GetAllTodos(todoRepository);
const getTodoByIdUseCase = new GetTodoById(todoRepository);
const updateTodoUseCase = new UpdateTodo(todoRepository);
const deleteTodoUseCase = new DeleteTodo(todoRepository);

export class TodoController {
  async createTodo(req: Request, res: Response): Promise<Response> {
    try {
      const todo = await createTodoUseCase.execute(req.body);
      return res.status(201).json({
        success: true,
        data: todo
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error creating todo',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getAllTodos(req: Request, res: Response): Promise<Response> {
    try {
      const todos = await getAllTodosUseCase.execute();
      return res.status(200).json({
        success: true,
        data: todos
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error getting todos',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getTodoById(req: Request, res: Response): Promise<Response> {
    try {
      const todo = await getTodoByIdUseCase.execute(req.params.id);
      
      if (!todo) {
        return res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: todo
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error getting todo',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateTodo(req: Request, res: Response): Promise<Response> {
    try {
      const todo = await updateTodoUseCase.execute(req.params.id, req.body);
      
      if (!todo) {
        return res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        data: todo
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error updating todo',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteTodo(req: Request, res: Response): Promise<Response> {
    try {
      const deleted = await deleteTodoUseCase.execute(req.params.id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Todo not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Todo deleted successfully'
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error deleting todo',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 
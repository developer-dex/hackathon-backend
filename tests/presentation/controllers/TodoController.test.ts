import { Request, Response } from 'express';
import { TodoController } from '../../../src/presentation/controllers/TodoController';
import { CreateTodo } from '../../../src/application/useCases/CreateTodo';
import { GetAllTodos } from '../../../src/application/useCases/GetAllTodos';
import { GetTodoById } from '../../../src/application/useCases/GetTodoById';
import { UpdateTodo } from '../../../src/application/useCases/UpdateTodo';
import { DeleteTodo } from '../../../src/application/useCases/DeleteTodo';
import { TodoRepositoryImpl } from '../../../src/infrastructure/repositories/TodoRepositoryImpl';

// Mock the use cases and repository
jest.mock('../../../src/application/useCases/CreateTodo');
jest.mock('../../../src/application/useCases/GetAllTodos');
jest.mock('../../../src/application/useCases/GetTodoById');
jest.mock('../../../src/application/useCases/UpdateTodo');
jest.mock('../../../src/application/useCases/DeleteTodo');
jest.mock('../../../src/infrastructure/repositories/TodoRepositoryImpl');

describe('TodoController', () => {
  let todoController: TodoController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    todoController = new TodoController();
    
    mockRequest = {
      body: {},
      params: {}
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });
  
  describe('createTodo', () => {
    it('should create a todo and return 201 status', async () => {
      // Arrange
      const todoData = {
        title: 'Test Todo',
        description: 'Test Description'
      };
      
      const createdTodo = {
        id: '123',
        title: todoData.title,
        description: todoData.description,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockRequest.body = todoData;
      
      // Set up mock implementation for the "execute" method on the prototype
      // This is the key fix - doing this directly affects the TodoController instance
      const executeCreateMock = jest.fn().mockResolvedValue(createdTodo);
      const originalExecute = CreateTodo.prototype.execute;
      CreateTodo.prototype.execute = executeCreateMock;
      
      // Act
      await todoController.createTodo(mockRequest as Request, mockResponse as Response);
      
      // Restore original method to avoid affecting other tests
      CreateTodo.prototype.execute = originalExecute;
      
      // Assert
      expect(executeCreateMock).toHaveBeenCalledWith(todoData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: createdTodo
      });
    });
    
    it('should return 500 status when creation fails', async () => {
      // Arrange
      const error = new Error('Creation failed');
      
      // Set up mock implementation
      const executeCreateMock = jest.fn().mockRejectedValue(error);
      const originalExecute = CreateTodo.prototype.execute;
      CreateTodo.prototype.execute = executeCreateMock;
      
      // Act
      await todoController.createTodo(mockRequest as Request, mockResponse as Response);
      
      // Restore original
      CreateTodo.prototype.execute = originalExecute;
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error creating todo',
        error: error.message
      });
    });
  });
  
  describe('getAllTodos', () => {
    it('should return all todos with 200 status', async () => {
      // Arrange
      const todos = [
        {
          id: '123',
          title: 'Todo 1',
          description: 'Description 1',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '456',
          title: 'Todo 2',
          description: 'Description 2',
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      // Set up mock implementation
      const executeGetAllMock = jest.fn().mockResolvedValue(todos);
      const originalExecute = GetAllTodos.prototype.execute;
      GetAllTodos.prototype.execute = executeGetAllMock;
      
      // Act
      await todoController.getAllTodos(mockRequest as Request, mockResponse as Response);
      
      // Restore original
      GetAllTodos.prototype.execute = originalExecute;
      
      // Assert
      expect(executeGetAllMock).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: todos
      });
    });
    
    it('should return 500 status when retrieval fails', async () => {
      // Arrange
      const error = new Error('Retrieval failed');
      
      // Set up mock implementation
      const executeGetAllMock = jest.fn().mockRejectedValue(error);
      const originalExecute = GetAllTodos.prototype.execute;
      GetAllTodos.prototype.execute = executeGetAllMock;
      
      // Act
      await todoController.getAllTodos(mockRequest as Request, mockResponse as Response);
      
      // Restore original
      GetAllTodos.prototype.execute = originalExecute;
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error getting todos',
        error: error.message
      });
    });
  });
  
  describe('getTodoById', () => {
    it('should return a todo by id with 200 status', async () => {
      // Arrange
      const todoId = '123';
      const todo = {
        id: todoId,
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockRequest.params = { id: todoId };
      
      // Set up mock implementation
      const executeGetByIdMock = jest.fn().mockResolvedValue(todo);
      const originalExecute = GetTodoById.prototype.execute;
      GetTodoById.prototype.execute = executeGetByIdMock;
      
      // Act
      await todoController.getTodoById(mockRequest as Request, mockResponse as Response);
      
      // Restore original
      GetTodoById.prototype.execute = originalExecute;
      
      // Assert
      expect(executeGetByIdMock).toHaveBeenCalledWith(todoId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: todo
      });
    });
    
    it('should return 404 status when todo not found', async () => {
      // Arrange
      const todoId = 'non-existent-id';
      
      mockRequest.params = { id: todoId };
      
      // Set up mock implementation
      const executeGetByIdMock = jest.fn().mockResolvedValue(null);
      const originalExecute = GetTodoById.prototype.execute;
      GetTodoById.prototype.execute = executeGetByIdMock;
      
      // Act
      await todoController.getTodoById(mockRequest as Request, mockResponse as Response);
      
      // Restore original
      GetTodoById.prototype.execute = originalExecute;
      
      // Assert
      expect(executeGetByIdMock).toHaveBeenCalledWith(todoId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Todo not found'
      });
    });
  });
  
  describe('updateTodo', () => {
    it('should update a todo and return 200 status', async () => {
      // Arrange
      const todoId = '123';
      const updateData = {
        title: 'Updated Title',
        description: 'Updated Description',
        completed: true
      };
      
      const updatedTodo = {
        id: todoId,
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      mockRequest.params = { id: todoId };
      mockRequest.body = updateData;
      
      // Set up mock implementation
      const executeUpdateMock = jest.fn().mockResolvedValue(updatedTodo);
      const originalExecute = UpdateTodo.prototype.execute;
      UpdateTodo.prototype.execute = executeUpdateMock;
      
      // Act
      await todoController.updateTodo(mockRequest as Request, mockResponse as Response);
      
      // Restore original
      UpdateTodo.prototype.execute = originalExecute;
      
      // Assert
      expect(executeUpdateMock).toHaveBeenCalledWith(todoId, updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: updatedTodo
      });
    });
    
    it('should return 404 status when todo not found for update', async () => {
      // Arrange
      const todoId = 'non-existent-id';
      
      mockRequest.params = { id: todoId };
      mockRequest.body = { title: 'Updated Title' };
      
      // Set up mock implementation
      const executeUpdateMock = jest.fn().mockResolvedValue(null);
      const originalExecute = UpdateTodo.prototype.execute;
      UpdateTodo.prototype.execute = executeUpdateMock;
      
      // Act
      await todoController.updateTodo(mockRequest as Request, mockResponse as Response);
      
      // Restore original
      UpdateTodo.prototype.execute = originalExecute;
      
      // Assert
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Todo not found'
      });
    });
  });
  
  describe('deleteTodo', () => {
    it('should delete a todo and return 200 status', async () => {
      // Arrange
      const todoId = '123';
      
      mockRequest.params = { id: todoId };
      
      // Set up mock implementation
      const executeDeleteMock = jest.fn().mockResolvedValue(true);
      const originalExecute = DeleteTodo.prototype.execute;
      DeleteTodo.prototype.execute = executeDeleteMock;
      
      // Act
      await todoController.deleteTodo(mockRequest as Request, mockResponse as Response);
      
      // Restore original
      DeleteTodo.prototype.execute = originalExecute;
      
      // Assert
      expect(executeDeleteMock).toHaveBeenCalledWith(todoId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        message: 'Todo deleted successfully'
      });
    });
    
    it('should return 404 status when todo not found for deletion', async () => {
      // Arrange
      const todoId = 'non-existent-id';
      
      mockRequest.params = { id: todoId };
      
      // Set up mock implementation
      const executeDeleteMock = jest.fn().mockResolvedValue(false);
      const originalExecute = DeleteTodo.prototype.execute;
      DeleteTodo.prototype.execute = executeDeleteMock;
      
      // Act
      await todoController.deleteTodo(mockRequest as Request, mockResponse as Response);
      
      // Restore original
      DeleteTodo.prototype.execute = originalExecute;
      
      // Assert
      expect(executeDeleteMock).toHaveBeenCalledWith(todoId);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Todo not found'
      });
    });
  });
}); 
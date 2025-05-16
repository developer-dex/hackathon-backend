import mongoose from 'mongoose';
import { Todo } from '../../../src/domain/entities/Todo';
import { TodoRepositoryImpl } from '../../../src/infrastructure/repositories/TodoRepositoryImpl';
import { TodoModel } from '../../../src/infrastructure/database/models/TodoModel';

// Valid MongoDB ObjectId (24 hex characters)
const VALID_ID_1 = '507f1f77bcf86cd799439011';
const VALID_ID_2 = '507f1f77bcf86cd799439012';

// Mock the TodoModel
jest.mock('../../../src/infrastructure/database/models/TodoModel', () => ({
  TodoModel: {
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn()
  }
}));

describe('TodoRepositoryImpl', () => {
  let todoRepository: TodoRepositoryImpl;
  
  beforeEach(() => {
    todoRepository = new TodoRepositoryImpl();
    jest.clearAllMocks();
  });
  
  describe('create', () => {
    it('should create a todo in database and return it', async () => {
      // Arrange
      const todoData = {
        id: VALID_ID_1,
        title: 'Test Todo',
        description: 'Test Description',
        completed: false
      };
      
      const todo = Todo.create(todoData);
      
      const createdTodoDoc = {
        _id: new mongoose.Types.ObjectId(VALID_ID_1),
        title: todoData.title,
        description: todoData.description,
        completed: todoData.completed,
        createdAt: new Date(),
        updatedAt: new Date(),
        toObject: () => ({
          _id: VALID_ID_1,
          title: todoData.title,
          description: todoData.description,
          completed: todoData.completed,
        })
      };
      
      (TodoModel.create as jest.Mock).mockResolvedValue(createdTodoDoc);
      
      // Act
      const result = await todoRepository.create(todo);
      
      // Assert
      expect(TodoModel.create).toHaveBeenCalledWith({
        title: todoData.title,
        description: todoData.description,
        completed: todoData.completed
      });
      
      expect(result).toBeInstanceOf(Todo);
      expect(result.id).toBe(createdTodoDoc._id.toString());
      expect(result.title).toBe(todoData.title);
    });
  });
  
  describe('findById', () => {
    it('should find todo by id and return it', async () => {
      // Arrange
      const todoId = VALID_ID_1;
      
      const todoDoc = {
        _id: new mongoose.Types.ObjectId(todoId),
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      (TodoModel.findById as jest.Mock).mockResolvedValue(todoDoc);
      
      // Act
      const result = await todoRepository.findById(todoId);
      
      // Assert
      expect(TodoModel.findById).toHaveBeenCalledWith(todoId);
      expect(result).toBeInstanceOf(Todo);
      expect(result!.id).toBe(todoId);
      expect(result!.title).toBe(todoDoc.title);
    });
    
    it('should return null when todo not found', async () => {
      // Arrange
      (TodoModel.findById as jest.Mock).mockResolvedValue(null);
      
      // Act
      const result = await todoRepository.findById('non-existent-id');
      
      // Assert
      expect(result).toBeNull();
    });
  });
  
  describe('findAll', () => {
    it('should return all todos', async () => {
      // Arrange
      const todoDocs = [
        {
          _id: new mongoose.Types.ObjectId(VALID_ID_1),
          title: 'Todo 1',
          description: 'Description 1',
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: new mongoose.Types.ObjectId(VALID_ID_2),
          title: 'Todo 2',
          description: 'Description 2',
          completed: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      (TodoModel.find as jest.Mock).mockResolvedValue(todoDocs);
      
      // Act
      const result = await todoRepository.findAll();
      
      // Assert
      expect(TodoModel.find).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Todo);
      expect(result[0].id).toBe(todoDocs[0]._id.toString());
      expect(result[1].id).toBe(todoDocs[1]._id.toString());
    });
  });
  
  describe('update', () => {
    it('should update a todo and return the updated version', async () => {
      // Arrange
      const todoId = VALID_ID_1;
      const todo = Todo.create({
        id: todoId,
        title: 'Updated Title',
        description: 'Updated Description',
        completed: true
      });
      
      const updatedTodoDoc = {
        _id: new mongoose.Types.ObjectId(todoId),
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      (TodoModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedTodoDoc);
      
      // Act
      const result = await todoRepository.update(todo);
      
      // Assert
      expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(
        todoId,
        {
          title: todo.title,
          description: todo.description,
          completed: todo.completed
        },
        { new: true }
      );
      
      expect(result).toBeInstanceOf(Todo);
      expect(result!.id).toBe(todoId);
      expect(result!.title).toBe(todo.title);
    });
    
    it('should return null when update fails', async () => {
      // Arrange
      const todoId = 'non-existent-id';
      const todo = Todo.create({
        id: todoId,
        title: 'Updated Title',
        description: 'Updated Description',
        completed: true
      });
      
      (TodoModel.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);
      
      // Act
      const result = await todoRepository.update(todo);
      
      // Assert
      expect(result).toBeNull();
    });
  });
  
  describe('delete', () => {
    it('should delete a todo and return true if successful', async () => {
      // Arrange
      const todoId = VALID_ID_1;
      const deletedTodoDoc = {
        _id: new mongoose.Types.ObjectId(todoId),
        title: 'To be deleted',
        description: 'Will be deleted',
        completed: false
      };
      
      (TodoModel.findByIdAndDelete as jest.Mock).mockResolvedValue(deletedTodoDoc);
      
      // Act
      const result = await todoRepository.delete(todoId);
      
      // Assert
      expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(todoId);
      expect(result).toBe(true);
    });
    
    it('should return false when todo not found for deletion', async () => {
      // Arrange
      (TodoModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
      
      // Act
      const result = await todoRepository.delete('non-existent-id');
      
      // Assert
      expect(result).toBe(false);
    });
  });
}); 
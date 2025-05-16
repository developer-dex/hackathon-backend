import { UpdateTodo } from '../../../src/application/useCases/UpdateTodo';
import { Todo } from '../../../src/domain/entities/Todo';
import { TodoRepository } from '../../../src/domain/interfaces/TodoRepository';
import { UpdateTodoDto } from '../../../src/dtos/TodoDto';

describe('UpdateTodo Use Case', () => {
  let mockTodoRepository: jest.Mocked<TodoRepository>;
  let updateTodoUseCase: UpdateTodo;
  
  beforeEach(() => {
    // Create a mock repository
    mockTodoRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    
    updateTodoUseCase = new UpdateTodo(mockTodoRepository);
  });
  
  it('should update a todo and return its updated data', async () => {
    // Arrange
    const todoId = '123';
    const date = new Date();
    
    const existingTodo = Todo.create({
      id: todoId,
      title: 'Original Title',
      description: 'Original Description',
      completed: false,
      createdAt: date,
      updatedAt: date
    });
    
    const updateTodoDto: UpdateTodoDto = {
      title: 'Updated Title',
      description: 'Updated Description',
      completed: true
    };
    
    const updatedTodo = Todo.create({
      id: todoId,
      title: updateTodoDto.title!,
      description: updateTodoDto.description!,
      completed: updateTodoDto.completed!,
      createdAt: date,
      updatedAt: new Date()
    });
    
    mockTodoRepository.findById.mockResolvedValue(existingTodo);
    mockTodoRepository.update.mockResolvedValue(updatedTodo);
    
    // Act
    const result = await updateTodoUseCase.execute(todoId, updateTodoDto);
    
    // Assert
    expect(mockTodoRepository.findById).toHaveBeenCalledWith(todoId);
    expect(mockTodoRepository.update).toHaveBeenCalled();
    expect(result).toEqual({
      id: todoId,
      title: updateTodoDto.title,
      description: updateTodoDto.description,
      completed: updateTodoDto.completed,
      createdAt: date,
      updatedAt: expect.any(Date)
    });
  });
  
  it('should return null when todo not found', async () => {
    // Arrange
    const todoId = 'non-existent-id';
    const updateTodoDto: UpdateTodoDto = {
      title: 'Updated Title'
    };
    
    mockTodoRepository.findById.mockResolvedValue(null);
    
    // Act
    const result = await updateTodoUseCase.execute(todoId, updateTodoDto);
    
    // Assert
    expect(mockTodoRepository.findById).toHaveBeenCalledWith(todoId);
    expect(mockTodoRepository.update).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
  
  it('should return null when update fails', async () => {
    // Arrange
    const todoId = '123';
    const date = new Date();
    
    const existingTodo = Todo.create({
      id: todoId,
      title: 'Original Title',
      description: 'Original Description',
      completed: false,
      createdAt: date,
      updatedAt: date
    });
    
    const updateTodoDto: UpdateTodoDto = {
      title: 'Updated Title'
    };
    
    mockTodoRepository.findById.mockResolvedValue(existingTodo);
    mockTodoRepository.update.mockResolvedValue(null);
    
    // Act
    const result = await updateTodoUseCase.execute(todoId, updateTodoDto);
    
    // Assert
    expect(mockTodoRepository.findById).toHaveBeenCalledWith(todoId);
    expect(mockTodoRepository.update).toHaveBeenCalled();
    expect(result).toBeNull();
  });
}); 
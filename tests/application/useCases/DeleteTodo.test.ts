import { DeleteTodo } from '../../../src/application/useCases/DeleteTodo';
import { TodoRepository } from '../../../src/domain/interfaces/TodoRepository';

describe('DeleteTodo Use Case', () => {
  let mockTodoRepository: jest.Mocked<TodoRepository>;
  let deleteTodoUseCase: DeleteTodo;
  
  beforeEach(() => {
    // Create a mock repository
    mockTodoRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    
    deleteTodoUseCase = new DeleteTodo(mockTodoRepository);
  });
  
  it('should delete a todo and return true if successful', async () => {
    // Arrange
    const todoId = '123';
    mockTodoRepository.delete.mockResolvedValue(true);
    
    // Act
    const result = await deleteTodoUseCase.execute(todoId);
    
    // Assert
    expect(mockTodoRepository.delete).toHaveBeenCalledWith(todoId);
    expect(result).toBe(true);
  });
  
  it('should return false when deletion fails', async () => {
    // Arrange
    const todoId = 'non-existent-id';
    mockTodoRepository.delete.mockResolvedValue(false);
    
    // Act
    const result = await deleteTodoUseCase.execute(todoId);
    
    // Assert
    expect(mockTodoRepository.delete).toHaveBeenCalledWith(todoId);
    expect(result).toBe(false);
  });
}); 
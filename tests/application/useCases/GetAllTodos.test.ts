import { GetAllTodos } from '../../../src/application/useCases/GetAllTodos';
import { Todo } from '../../../src/domain/entities/Todo';
import { TodoRepository } from '../../../src/domain/interfaces/TodoRepository';

describe('GetAllTodos Use Case', () => {
  let mockTodoRepository: jest.Mocked<TodoRepository>;
  let getAllTodosUseCase: GetAllTodos;
  
  beforeEach(() => {
    // Create a mock repository
    mockTodoRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    
    getAllTodosUseCase = new GetAllTodos(mockTodoRepository);
  });
  
  it('should return all todos', async () => {
    // Arrange
    const date = new Date();
    
    const todos = [
      Todo.create({
        id: '1',
        title: 'Todo 1',
        description: 'Description 1',
        completed: false,
        createdAt: date,
        updatedAt: date
      }),
      Todo.create({
        id: '2',
        title: 'Todo 2',
        description: 'Description 2',
        completed: true,
        createdAt: date,
        updatedAt: date
      })
    ];
    
    mockTodoRepository.findAll.mockResolvedValue(todos);
    
    // Act
    const result = await getAllTodosUseCase.execute();
    
    // Assert
    expect(mockTodoRepository.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[0].title).toBe('Todo 1');
    expect(result[1].id).toBe('2');
    expect(result[1].title).toBe('Todo 2');
  });
  
  it('should return empty array when no todos exist', async () => {
    // Arrange
    mockTodoRepository.findAll.mockResolvedValue([]);
    
    // Act
    const result = await getAllTodosUseCase.execute();
    
    // Assert
    expect(mockTodoRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
}); 
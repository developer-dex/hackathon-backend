import { CreateTodo } from '../../../src/application/useCases/CreateTodo';
import { Todo } from '../../../src/domain/entities/Todo';
import { TodoRepository } from '../../../src/domain/interfaces/TodoRepository';
import { CreateTodoDto } from '../../../src/dtos/TodoDto';

// Mock UUID to have consistent IDs in tests
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid')
}));

describe('CreateTodo Use Case', () => {
  let mockTodoRepository: jest.Mocked<TodoRepository>;
  let createTodoUseCase: CreateTodo;
  
  beforeEach(() => {
    // Create a mock repository
    mockTodoRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    
    createTodoUseCase = new CreateTodo(mockTodoRepository);
  });
  
  it('should create a todo and return its data', async () => {
    // Arrange
    const createTodoDto: CreateTodoDto = {
      title: 'Test Todo',
      description: 'Test Description'
    };
    
    const createdDate = new Date();
    
    const createdTodo = Todo.create({
      id: 'mocked-uuid',
      title: createTodoDto.title,
      description: createTodoDto.description,
      completed: false,
      createdAt: createdDate,
      updatedAt: createdDate
    });
    
    mockTodoRepository.create.mockResolvedValue(createdTodo);
    
    // Act
    const result = await createTodoUseCase.execute(createTodoDto);
    
    // Assert
    expect(mockTodoRepository.create).toHaveBeenCalled();
    expect(result).toEqual({
      id: 'mocked-uuid',
      title: createTodoDto.title,
      description: createTodoDto.description,
      completed: false,
      createdAt: createdDate,
      updatedAt: createdDate
    });
  });
}); 
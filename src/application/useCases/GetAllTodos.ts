import { TodoRepository } from '../../domain/repositories/TodoRepository';
import { TodoResponseDto } from '../../dtos/TodoDto';
import { TodoMapper } from '../../mappers/TodoMapper';

export class GetAllTodos {
  constructor(private todoRepository: TodoRepository) {}

  async execute(): Promise<TodoResponseDto[]> {
    const todos = await this.todoRepository.findAll();
    return todos.map(todo => TodoMapper.toResponseDto(todo));
  }
} 
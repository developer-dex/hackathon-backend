import { TodoRepository } from '../../domain/repositories/TodoRepository';
import { TodoResponseDto } from '../../dtos/TodoDto';
import { TodoMapper } from '../../mappers/TodoMapper';

export class GetTodoById {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: string): Promise<TodoResponseDto | null> {
    const todo = await this.todoRepository.findById(id);
    
    if (!todo) {
      return null;
    }
    
    return TodoMapper.toResponseDto(todo);
  }
} 
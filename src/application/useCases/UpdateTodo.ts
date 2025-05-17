import { TodoRepository } from '../../domain/repositories/TodoRepository';
import { TodoResponseDto, UpdateTodoDto } from '../../dtos/TodoDto';
import { TodoMapper } from '../../mappers/TodoMapper';

export class UpdateTodo {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: string, dto: UpdateTodoDto): Promise<TodoResponseDto | null> {
    const existingTodo = await this.todoRepository.findById(id);
    
    if (!existingTodo) {
      return null;
    }
    
    const updatedTodo = TodoMapper.updateEntity(existingTodo, dto);
    const result = await this.todoRepository.update(updatedTodo);
    
    if (!result) {
      return null;
    }
    
    return TodoMapper.toResponseDto(result);
  }
} 
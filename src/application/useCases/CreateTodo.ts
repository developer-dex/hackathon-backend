import { Todo } from '../../domain/entities/Todo';
import { TodoRepository } from '../../domain/repositories/TodoRepository';
import { CreateTodoDto, TodoResponseDto } from '../../dtos/TodoDto';
import { TodoMapper } from '../../mappers/TodoMapper';

export class CreateTodo {
  constructor(private todoRepository: TodoRepository) {}

  async execute(dto: CreateTodoDto): Promise<TodoResponseDto> {
    const todoEntity = TodoMapper.toEntity(dto);
    const createdTodo = await this.todoRepository.create(todoEntity);
    return TodoMapper.toResponseDto(createdTodo);
  }
} 
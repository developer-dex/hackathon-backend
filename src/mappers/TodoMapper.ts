import { Todo } from '../domain/entities/Todo';
import { CreateTodoDto, TodoResponseDto, UpdateTodoDto } from '../dtos/TodoDto';
import { v4 as uuidv4 } from 'uuid';

export class TodoMapper {
  static toEntity(dto: CreateTodoDto): Todo {
    return Todo.create({
      id: uuidv4(),
      title: dto.title,
      description: dto.description,
      completed: dto.completed || false
    });
  }

  static toResponseDto(todo: Todo): TodoResponseDto {
    return {
      id: todo.id as string,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt
    };
  }

  static updateEntity(todo: Todo, dto: UpdateTodoDto): Todo {
    if (dto.title !== undefined) {
      todo.updateTitle(dto.title);
    }

    if (dto.description !== undefined) {
      todo.updateDescription(dto.description);
    }

    if (dto.completed !== undefined && dto.completed && !todo.completed) {
      todo.markAsCompleted();
    }

    return todo;
  }
} 
import { TodoRepository } from '../../domain/interfaces/TodoRepository';

export class DeleteTodo {
  constructor(private todoRepository: TodoRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.todoRepository.delete(id);
  }
} 
import { Todo } from '../../domain/entities/Todo';
import { TodoRepository } from '../../domain/repositories/TodoRepository';
import { TodoModel, TodoDocument } from '../database/models/TodoModel';

export class TodoRepositoryImpl implements TodoRepository {
  async create(todo: Todo): Promise<Todo> {
    const todoData = {
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
    };

    const createdTodo = await TodoModel.create(todoData);
    
    return Todo.create({
      id: createdTodo._id.toString(),
      title: createdTodo.title,
      description: createdTodo.description,
      completed: createdTodo.completed,
      createdAt: createdTodo.createdAt,
      updatedAt: createdTodo.updatedAt
    });
  }

  async findById(id: string): Promise<Todo | null> {
    const todo = await TodoModel.findById(id);
    
    if (!todo) {
      return null;
    }
    
    return Todo.create({
      id: todo._id.toString(),
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt
    });
  }

  async findAll(): Promise<Todo[]> {
    const todos = await TodoModel.find();
    
    return todos.map(todo => 
      Todo.create({
        id: todo._id.toString(),
        title: todo.title,
        description: todo.description,
        completed: todo.completed,
        createdAt: todo.createdAt,
        updatedAt: todo.updatedAt
      })
    );
  }

  async update(todo: Todo): Promise<Todo | null> {
    const updatedTodo = await TodoModel.findByIdAndUpdate(
      todo.id,
      {
        title: todo.title,
        description: todo.description,
        completed: todo.completed
      },
      { new: true }
    );
    
    if (!updatedTodo) {
      return null;
    }
    
    return Todo.create({
      id: updatedTodo._id.toString(),
      title: updatedTodo.title,
      description: updatedTodo.description,
      completed: updatedTodo.completed,
      createdAt: updatedTodo.createdAt,
      updatedAt: updatedTodo.updatedAt
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await TodoModel.findByIdAndDelete(id);
    return result !== null;
  }
} 
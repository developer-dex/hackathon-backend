import { Todo } from '../../../src/domain/entities/Todo';

describe('Todo Entity', () => {
  const todoProps = {
    id: '123',
    title: 'Test Todo',
    description: 'Test Description',
    completed: false,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  };

  it('should create a new todo instance', () => {
    const todo = Todo.create(todoProps);
    
    expect(todo.id).toBe(todoProps.id);
    expect(todo.title).toBe(todoProps.title);
    expect(todo.description).toBe(todoProps.description);
    expect(todo.completed).toBe(todoProps.completed);
    expect(todo.createdAt).toEqual(todoProps.createdAt);
    expect(todo.updatedAt).toEqual(todoProps.updatedAt);
  });

  it('should create a todo with default completed value when not provided', () => {
    const todoWithoutCompleted = Todo.create({
      title: 'Test Todo',
      description: 'Test Description',
    });
    
    expect(todoWithoutCompleted.completed).toBe(false);
  });

  it('should mark a todo as completed', () => {
    const todo = Todo.create(todoProps);
    
    todo.markAsCompleted();
    
    expect(todo.completed).toBe(true);
    expect(todo.updatedAt).not.toEqual(todoProps.updatedAt);
  });

  it('should update todo title', () => {
    const todo = Todo.create(todoProps);
    const newTitle = 'Updated Title';
    
    todo.updateTitle(newTitle);
    
    expect(todo.title).toBe(newTitle);
    expect(todo.updatedAt).not.toEqual(todoProps.updatedAt);
  });

  it('should update todo description', () => {
    const todo = Todo.create(todoProps);
    const newDescription = 'Updated Description';
    
    todo.updateDescription(newDescription);
    
    expect(todo.description).toBe(newDescription);
    expect(todo.updatedAt).not.toEqual(todoProps.updatedAt);
  });

  it('should update todo with multiple properties', () => {
    const todo = Todo.create(todoProps);
    const newTitle = 'Updated Title';
    const newDescription = 'Updated Description';
    const newCompleted = true;
    
    todo.update(newTitle, newDescription, newCompleted);
    
    expect(todo.title).toBe(newTitle);
    expect(todo.description).toBe(newDescription);
    expect(todo.completed).toBe(newCompleted);
    expect(todo.updatedAt).not.toEqual(todoProps.updatedAt);
  });

  it('should convert todo to object', () => {
    const todo = Todo.create(todoProps);
    const todoObject = todo.toObject();
    
    expect(todoObject).toEqual({
      id: todoProps.id,
      title: todoProps.title,
      description: todoProps.description,
      completed: todoProps.completed,
      createdAt: todoProps.createdAt,
      updatedAt: todoProps.updatedAt
    });
  });
}); 
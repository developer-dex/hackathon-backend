export interface TodoProps {
  id?: string;
  title: string;
  description: string;
  completed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Todo {
  private props: TodoProps & { completed: boolean };

  private constructor(props: TodoProps) {
    this.props = {
      ...props,
      completed: props.completed !== undefined ? props.completed : false,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date()
    };
  }

  static create(props: TodoProps): Todo {
    return new Todo(props);
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string {
    return this.props.description;
  }

  get completed(): boolean {
    return this.props.completed;
  }

  get createdAt(): Date {
    return this.props.createdAt as Date;
  }

  get updatedAt(): Date {
    return this.props.updatedAt as Date;
  }

  markAsCompleted(): void {
    this.props.completed = true;
    this.props.updatedAt = new Date();
  }

  updateTitle(title: string): void {
    this.props.title = title;
    this.props.updatedAt = new Date();
  }

  updateDescription(description: string): void {
    this.props.description = description;
    this.props.updatedAt = new Date();
  }

  update(title: string, description: string, completed: boolean): void {
    this.props.title = title;
    this.props.description = description;
    this.props.completed = completed;
    this.props.updatedAt = new Date();
  }

  toObject(): TodoProps {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
} 
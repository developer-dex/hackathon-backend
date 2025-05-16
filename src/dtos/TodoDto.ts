export interface CreateTodoDto {
  title: string;
  description: string;
  completed?: boolean;
}

export interface UpdateTodoDto {
  title?: string;
  description?: string;
  completed?: boolean;
}

export interface TodoResponseDto {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
} 
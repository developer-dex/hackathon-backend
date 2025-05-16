import mongoose, { Document, Schema } from 'mongoose';

export interface TodoDocument extends Document {
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const TodoModel = mongoose.model<TodoDocument>('Todo', todoSchema); 
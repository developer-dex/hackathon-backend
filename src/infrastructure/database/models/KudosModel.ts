import mongoose, { Document, Schema } from 'mongoose';

export interface KudosDocument extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const kudosSchema = new Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'KudosCategory',
      required: true
    },
    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

// Add index for efficient querying of kudos by sender and receiver
kudosSchema.index({ senderId: 1, receiverId: 1 });
kudosSchema.index({ categoryId: 1 }); // Index for category queries

export const KudosModel = mongoose.model<KudosDocument>('Kudos', kudosSchema); 
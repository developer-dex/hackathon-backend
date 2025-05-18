import mongoose, { Document, Schema } from 'mongoose';

export interface KudosDocument extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  teamId: mongoose.Types.ObjectId;
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
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
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
kudosSchema.index({ senderId: 1, receiverId: 1 });
kudosSchema.index({ categoryId: 1 });
kudosSchema.index({ teamId: 1 });

export const KudosModel = mongoose.model<KudosDocument>('Kudos', kudosSchema); 
import mongoose, { Document, Schema } from 'mongoose';

export interface ForgotPasswordDocument extends Document {
  userId: mongoose.Types.ObjectId;
  email: string;
  token: string;
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const forgotPasswordSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    token: {
      type: String,
      required: true,
      unique: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    isUsed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

forgotPasswordSchema.index({ token: 1 });
forgotPasswordSchema.index({ email: 1 });
forgotPasswordSchema.index({ expiresAt: 1, isUsed: 1 });

export const ForgotPasswordModel = mongoose.model<ForgotPasswordDocument>('ForgotPassword', forgotPasswordSchema); 
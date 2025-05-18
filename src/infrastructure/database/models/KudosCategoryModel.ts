import mongoose, { Document, Schema } from 'mongoose';

export interface KudosCategoryDocument extends Document {
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const kudosCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      uppercase: true
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },
    icon: {
      type: String,
      required: true,
      trim: true
    },
    color: {
      type: String,
      required: true,
      trim: true,
      default: '#3498db',
      validate: {
        validator: (value: string) => {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value);
        },
        message: 'Color must be a valid hex color code'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

kudosCategorySchema.index({ name: 'text', description: 'text' });

export const KudosCategoryModel = mongoose.model<KudosCategoryDocument>('KudosCategory', kudosCategorySchema);

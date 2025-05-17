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

// Add text index for searching categories
kudosCategorySchema.index({ name: 'text', description: 'text' });

export const KudosCategoryModel = mongoose.model<KudosCategoryDocument>('KudosCategory', kudosCategorySchema);

// Seed default categories if none exist
export const seedDefaultCategories = async (): Promise<void> => {
  const count = await KudosCategoryModel.countDocuments();
  if (count === 0) {
    const defaultCategories = [
      {
        name: 'TEAMWORK',
        description: 'Recognition for excellent collaboration and team spirit',
        icon: 'users',
        color: '#3498db'
      },
      {
        name: 'INNOVATION',
        description: 'Recognition for creative solutions and innovative thinking',
        icon: 'lightbulb',
        color: '#9b59b6'
      },
      {
        name: 'EXCELLENCE',
        description: 'Recognition for outstanding performance and quality work',
        icon: 'star',
        color: '#f1c40f'
      },
      {
        name: 'LEADERSHIP',
        description: 'Recognition for guiding others and leading by example',
        icon: 'trophy',
        color: '#e74c3c'
      },
      {
        name: 'HELPFULNESS',
        description: 'Recognition for providing support and assistance to others',
        icon: 'hands-helping',
        color: '#2ecc71'
      }
    ];

    await KudosCategoryModel.insertMany(defaultCategories);
  }
}; 
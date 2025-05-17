import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { EUserRole, VerificationStatus } from '../../../domain/entities/User';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: EUserRole;
  teamId: mongoose.Types.ObjectId;
  verificationStatus: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: 'Invalid email format'
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    role: {
      type: String,
      enum: Object.values(EUserRole),
      default: EUserRole.TEAM_MEMBER
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true
    },
    verificationStatus: {
      type: String,
      enum: Object.values(VerificationStatus),
      default: VerificationStatus.PENDING
    }
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  const user = this as UserDocument;
  
  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) {
    console.log('Password not modified');
    return next();
  }
  
  try {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    console.log('Password hashed');
    next();
  } catch (error) {
    next(error as Error);
  }
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema); 
import mongoose, { Document, Schema } from 'mongoose';

export interface TeamDocument extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<TeamDocument>({
  name: {
    type: String,
    required: true,
    trim: true
  }
}, { 
  timestamps: true 
});

export const TeamModel = mongoose.model<TeamDocument>('Team', teamSchema); 
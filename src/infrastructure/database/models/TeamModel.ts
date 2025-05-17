import mongoose, { Document, Schema } from 'mongoose';

// Define the Team document interface
export interface TeamDocument extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create the Team schema
const teamSchema = new Schema<TeamDocument>({
  name: {
    type: String,
    required: true,
    trim: true
  }
}, { 
  timestamps: true 
});

// Create and export the Team model
export const TeamModel = mongoose.model<TeamDocument>('Team', teamSchema); 
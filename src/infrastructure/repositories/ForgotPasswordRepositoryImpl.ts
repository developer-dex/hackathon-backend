import { IForgotPasswordRepository } from '../../domain/interfaces/repositories/ForgotPasswordRepository';
import { ForgotPassword } from '../../domain/entities/ForgotPassword';
import { ForgotPasswordModel } from '../database/models/ForgotPasswordModel';
import { ForgotPasswordMapper } from '../../mappers/ForgotPasswordMapper';
import { TIME_CONSTANTS } from '../../application/constants/timeConstants';
import crypto from 'crypto';
import mongoose from 'mongoose';

export class ForgotPasswordRepositoryImpl implements IForgotPasswordRepository {

  async createPasswordResetToken(email: string, userId: string): Promise<ForgotPassword | null> {
    try {
      const token = crypto.randomBytes(32).toString('hex');
      
      const expiresAt = new Date(Date.now() + TIME_CONSTANTS.FORGOT_PASSWORD_TOKEN_EXPIRY);
      
      const forgotPasswordDoc = new ForgotPasswordModel({
        userId: new mongoose.Types.ObjectId(userId),
        email,
        token,
        expiresAt,
        isUsed: false
      });
      
      const savedDoc = await forgotPasswordDoc.save();
      
      return ForgotPasswordMapper.toDomain(savedDoc);
    } catch (error) {
      console.error('Error creating password reset token:', error);
      return null;
    }
  }


  async findByToken(token: string): Promise<ForgotPassword | null> {
    try {
      const forgotPasswordDoc = await ForgotPasswordModel.findOne({ token });
      return ForgotPasswordMapper.toDomain(forgotPasswordDoc);
    } catch (error) {
      console.error('Error finding password reset token:', error);
      return null;
    }
  }

  async markAsUsed(token: string): Promise<boolean> {
    try {
      const result = await ForgotPasswordModel.updateOne(
        { token },
        { isUsed: true }
      );
      
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error marking password reset token as used:', error);
      return false;
    }
  }

  async deleteExpiredTokens(userId: string): Promise<number> {
    try {
      const now = new Date();
      
      const result = await ForgotPasswordModel.deleteMany({
        $or: [
          { userId: new mongoose.Types.ObjectId(userId) }
        ]
      });
      
      return result.deletedCount || 0;
    } catch (error) {
      console.error('Error deleting expired tokens:', error);
      return 0;
    }
  }
} 
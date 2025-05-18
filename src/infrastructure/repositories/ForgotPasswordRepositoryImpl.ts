import { IForgotPasswordRepository } from '../../domain/interfaces/repositories/ForgotPasswordRepository';
import { ForgotPassword } from '../../domain/entities/ForgotPassword';
import { ForgotPasswordModel } from '../database/models/ForgotPasswordModel';
import { ForgotPasswordMapper } from '../../mappers/ForgotPasswordMapper';
import { TIME_CONSTANTS } from '../../application/constants/timeConstants';
import crypto from 'crypto';
import mongoose from 'mongoose';

/**
 * Implementation of the ForgotPassword repository
 */
export class ForgotPasswordRepositoryImpl implements IForgotPasswordRepository {
  /**
   * Create a new password reset token
   * @param email The email of the user requesting password reset
   * @param userId The ID of the user
   * @returns A ForgotPassword domain entity or null if creation failed
   */
  async createPasswordResetToken(email: string, userId: string): Promise<ForgotPassword | null> {
    try {
      // Generate a secure random token
      const token = crypto.randomBytes(32).toString('hex');
      
      // Calculate expiry time (20 minutes from now)
      const expiresAt = new Date(Date.now() + TIME_CONSTANTS.FORGOT_PASSWORD_TOKEN_EXPIRY);
      
      // Create new reset token document
      const forgotPasswordDoc = new ForgotPasswordModel({
        userId: new mongoose.Types.ObjectId(userId),
        email,
        token,
        expiresAt,
        isUsed: false
      });
      
      // Save to database
      const savedDoc = await forgotPasswordDoc.save();
      
      // Convert to domain entity and return
      return ForgotPasswordMapper.toDomain(savedDoc);
    } catch (error) {
      console.error('Error creating password reset token:', error);
      return null;
    }
  }

  /**
   * Find a password reset token by its token value
   * @param token The token to search for
   * @returns A ForgotPassword domain entity or null if not found
   */
  async findByToken(token: string): Promise<ForgotPassword | null> {
    try {
      const forgotPasswordDoc = await ForgotPasswordModel.findOne({ token });
      return ForgotPasswordMapper.toDomain(forgotPasswordDoc);
    } catch (error) {
      console.error('Error finding password reset token:', error);
      return null;
    }
  }

  /**
   * Mark a password reset token as used
   * @param token The token to mark as used
   * @returns True if the operation was successful, false otherwise
   */
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

  /**
   * Delete all expired and used tokens
   * @returns The number of tokens deleted
   */
  async deleteExpiredTokens(): Promise<number> {
    try {
      const now = new Date();
      
      const result = await ForgotPasswordModel.deleteMany({
        $or: [
          { expiresAt: { $lt: now } }, // Expired tokens
          { isUsed: true } // Used tokens
        ]
      });
      
      return result.deletedCount || 0;
    } catch (error) {
      console.error('Error deleting expired tokens:', error);
      return 0;
    }
  }
} 
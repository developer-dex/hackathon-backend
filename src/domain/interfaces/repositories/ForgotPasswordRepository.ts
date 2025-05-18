import { ForgotPassword } from '../../entities/ForgotPassword';

export interface IForgotPasswordRepository {
  createPasswordResetToken(email: string, userId: string): Promise<ForgotPassword | null>;
  findByToken(token: string): Promise<ForgotPassword | null>;
  markAsUsed(token: string): Promise<boolean>;
  deleteExpiredTokens(): Promise<number>; // Returns count of deleted tokens
} 
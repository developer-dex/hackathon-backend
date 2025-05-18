import { IUserRepository } from '../../../domain/interfaces/repositories/UserRepository';
import { User, VerificationStatus } from '../../../domain/entities/User';

export class UpdateUserVerificationStatus {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string, status: string): Promise<User | null> {
    try {
      if (!Object.values(VerificationStatus).includes(status as VerificationStatus)) {
        throw new Error(`Invalid verification status: ${status}`);
      }

      return await this.userRepository.updateVerificationStatus(
        userId, 
        status as VerificationStatus
      );
    } catch (error) {
      console.error('Error in UpdateUserVerificationStatus use case:', error);
      return null;
    }
  }
} 
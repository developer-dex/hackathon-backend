import { User } from '../../entities/User';

export interface IUserRepository {
  // ... existing methods ...
  
  /**
   * Update a user's role
   * @param userId The ID of the user to update
   * @param role The new role for the user
   * @returns The updated user or null if not found
   */
  updateUserRole(userId: string, role: string): Promise<User | null>;
} 
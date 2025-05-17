import { IUserRepository } from "../../../domain/interfaces/repositories/IUserRepository";
import { User } from "../../../domain/entities/User";

export class GetAllUsers {
  constructor(private userRepository: IUserRepository) {}

  async execute(role?: string, limit?: number, offset: number = 0): Promise<{
    users: User[];
    totalCount: number;
  }> {
    try {
      // Use database-level pagination by passing limit and offset directly to repository
      const skip = (offset ? offset - 1 : 0) * (limit || 0);
      const users = await this.userRepository.getAllUsers(role, limit, skip);
      const totalCount = await this.userRepository.getTotalUsersCount(role);

      return {
        users,
        totalCount
      };
    } catch (error) {
      console.error("Error in GetAllUsers use case:", error);
      return {
        users: [],
        totalCount: 0
      };
    }
  }
} 
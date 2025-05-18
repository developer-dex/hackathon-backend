import { IUserRepository } from "../../../domain/interfaces/repositories/UserRepository";
import { User } from "../../../domain/entities/User";

export class GetAllUsers {
  constructor(private userRepository: IUserRepository) {}

  async execute(role?: string, limit?: number, page?: number): Promise<{
    users: User[];
    totalCount: number;
  }> {
    try {
      const users = await this.userRepository.getAllUsers(role, limit, page);
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
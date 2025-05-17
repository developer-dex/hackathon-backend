import { User, UserDTO } from '../../domain/entities/User';
import { UserRepositoryImpl } from './UserRepositoryImpl';
import { AuthRepository } from '../../domain/interfaces/repositories/AuthRepository';
import { UserMapper } from '../../mappers/UserMapper';

export class AuthRepositoryImpl implements AuthRepository {
  private userRepository: UserRepositoryImpl;

  constructor() {
    this.userRepository = new UserRepositoryImpl();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async verifyPassword(providedPassword: string, storedPassword: string): Promise<boolean> {
    return this.userRepository.verifyPassword(providedPassword, storedPassword);
  }

  generateToken(user: UserDTO): string {
    return this.userRepository.generateToken(user);
  }

  async verifyToken(token: string): Promise<UserDTO | null> {
    const authUser = await this.userRepository.verifyToken(token);
    return UserMapper.authToDomainDTO(authUser);
  }
}
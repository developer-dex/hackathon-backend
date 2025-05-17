import { User, UserDTO } from '../../entities/User';

export interface AuthRepository {
  getUserByEmail(email: string): Promise<User | null>;
  verifyPassword(providedPassword: string, storedPassword: string): Promise<boolean>;
  generateToken(user: UserDTO): string;
  verifyToken(token: string): Promise<UserDTO | null>;
} 
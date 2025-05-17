import { User } from '../entities/User';
import { UserDTO } from '../../dtos/UserDto';
import { SignupRequestDto } from '../../dtos/SignupDto';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(userData: SignupRequestDto): Promise<User | null>;
  verifyPassword(providedPassword: string, storedPassword: string): Promise<boolean>;
  generateToken(user: UserDTO): string;
  verifyToken(token: string): Promise<UserDTO | null>;
} 
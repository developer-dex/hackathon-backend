import { User } from '../../entities/User';
import { UserDTO } from '../../../dtos/AuthDto';
import { SignupRequestDto } from '../../../dtos/AuthDto';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  createUser(userData: SignupRequestDto): Promise<User | null>;
  verifyPassword(providedPassword: string, storedPassword: string): Promise<boolean>;
  generateToken(user: UserDTO): string;
  verifyToken(token: string): Promise<UserDTO | null>;
} 
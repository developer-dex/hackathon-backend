import { User, VerificationStatus } from '../../entities/User';
import { UserDTO } from '../../../dtos/AuthDto';
import { SignupRequestDto } from '../../../dtos/AuthDto';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByIdWithoutDeleteUser(id: string): Promise<User | null>;
  createUser(userData: SignupRequestDto): Promise<User | null>;
  verifyPassword(providedPassword: string, storedPassword: string): Promise<boolean>;
  generateToken(user: UserDTO): string;
  verifyToken(token: string): Promise<UserDTO | null>;
  getAllUsers(role?: string, limit?: number, page?: number): Promise<User[]>;
  getTotalUsersCount(role?: string): Promise<number>;
  updateVerificationStatus(userId: string, status: VerificationStatus): Promise<User | null>;
  updateUser(userId: string, userData: UserDTO): Promise<User | null>;
  updatePassword(userId: string, newPassword: string): Promise<User | null>;
  toggleUserActiveStatus(userId: string, isActive: boolean): Promise<User | null>;
} 
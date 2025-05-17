import { UserRole, VerificationStatus } from '../domain/entities/User';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  user: UserDTO;
  token: string;
} 
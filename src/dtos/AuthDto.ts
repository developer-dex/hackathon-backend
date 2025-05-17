import { EUserRole, VerificationStatus } from '../domain/entities/User';

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: EUserRole;
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

export interface SignupRequestDto {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: EUserRole;
  department: string;
}

export interface SignupResponseDto {
  id: string;
  name: string;
  email: string;
  role: EUserRole;
  department: string;
  createdAt: string;
  updatedAt: string;
}

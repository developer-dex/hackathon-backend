export enum EUserRole {
  TEAM_MEMBER = 'TEAM_MEMBER',
  TEAM_LEAD = 'TEAM_LEAD'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: EUserRole;
  department: string;
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: UserDTO;
  token: string;
} 
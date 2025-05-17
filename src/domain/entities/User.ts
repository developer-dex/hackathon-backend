export enum UserRole {
  TEAM_MEMBER = 'TEAM_MEMBER',
  TEAM_LEAD = 'TEAM_LEAD'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

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


export class User {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: UserRole,
    public readonly department: string,
    public readonly verificationStatus: VerificationStatus,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  static create(props: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    department: string;
    verificationStatus: VerificationStatus;
    createdAt: string;
    updatedAt: string;
  }): User {
    return new User(
      props.id,
      props.name,
      props.email,
      props.password,
      props.role,
      props.department,
      props.verificationStatus,
      props.createdAt,
      props.updatedAt
    );
  }
} 
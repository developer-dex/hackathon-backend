export enum EUserRole {
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
  role: EUserRole;
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
    public readonly role: EUserRole,
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
    role: EUserRole;
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

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }
  
  getRole(): EUserRole {
    return this.role;
  }
  
  getDepartment(): string {
    return this.department;
  }

  getVerificationStatus(): VerificationStatus {
    return this.verificationStatus;
  }
  
  getCreatedAt(): string {
    return this.createdAt;
  }
  
  getUpdatedAt(): string {
    return this.updatedAt;
  }
} 


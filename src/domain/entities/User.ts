import { TeamDTO } from "../../dtos/TeamDto";

export enum EUserRole {
  TEAM_MEMBER = 'Team Member',
  TEAM_LEAD = 'Team Lead',
  ADMIN = 'Admin'
}

export enum VerificationStatus {
  PENDING = 'Pending',
  VERIFIED = 'Verified',
  REJECTED = 'Rejected'
}

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  role: EUserRole;
  teamId: string;
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
    public readonly teamId: TeamDTO,
    public readonly verificationStatus: VerificationStatus,
    public readonly createdAt: string,
    public readonly updatedAt: string,
    public readonly deletedAt: string | null = null
  ) {}

  static create(props: {
    id: string;
    name: string;
    email: string;
    password: string;
    role: EUserRole;
    teamId: TeamDTO;
    verificationStatus: VerificationStatus;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string | null;
  }): User {
    return new User(
      props.id,
      props.name,
      props.email,
      props.password,
      props.role,
      props.teamId,
      props.verificationStatus,
      props.createdAt,
      props.updatedAt,
      props.deletedAt || null
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
  
  getTeamId(): TeamDTO {
    return this.teamId;
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

  getDeletedAt(): string | null {
    return this.deletedAt;
  }

  isActive(): boolean {
    return this.deletedAt === null;
  }
} 


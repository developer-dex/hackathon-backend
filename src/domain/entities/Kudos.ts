export enum EKudosCategory {
  TEAMWORK = 'TEAMWORK',
  INNOVATION = 'INNOVATION',
  EXCELLENCE = 'EXCELLENCE',
  LEADERSHIP = 'LEADERSHIP',
  HELPFULNESS = 'HELPFULNESS'
}

export class Kudos {
  private constructor(
    public readonly id: string,
    public readonly senderId: string,
    public readonly receiverId: string,
    public readonly categoryId: string,
    public readonly teamId: string,
    public readonly message: string,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  static create(props: {
    id: string;
    senderId: string;
    receiverId: string;
    categoryId: string;
    teamId: string;
    message: string;
    createdAt: string;
    updatedAt: string;
  }): Kudos {
    return new Kudos(
      props.id,
      props.senderId,
      props.receiverId,
      props.categoryId,
      props.teamId,
      props.message,
      props.createdAt,
      props.updatedAt
    );
  }

  getId(): string {
    return this.id;
  }

  getSenderId(): string {
    return this.senderId;
  }

  getReceiverId(): string {
    return this.receiverId;
  }

  getCategoryId(): string {
    return this.categoryId;
  }

  getTeamId(): string {
    return this.teamId;
  }

  getMessage(): string {
    return this.message;
  }

  getCreatedAt(): string {
    return this.createdAt;
  }

  getUpdatedAt(): string {
    return this.updatedAt;
  }
} 
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
    public readonly message: string,
    public readonly teamName: string,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  static create(props: {
    id: string;
    senderId: string;
    receiverId: string;
    categoryId: string;
    message: string;
    teamName: string;
    createdAt: string;
    updatedAt: string;
  }): Kudos {
    return new Kudos(
      props.id,
      props.senderId,
      props.receiverId,
      props.categoryId,
      props.message,
      props.teamName,
      props.createdAt,
      props.updatedAt
    );
  }
} 
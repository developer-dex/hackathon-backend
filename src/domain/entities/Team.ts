export class Team {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  static create(props: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  }): Team {
    return new Team(
      props.id,
      props.name,
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

  getCreatedAt(): string {
    return this.createdAt;
  }

  getUpdatedAt(): string {
    return this.updatedAt;
  }
  
} 
export class KudosCategory {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly icon: string,
    public readonly color: string,
    public readonly isActive: boolean,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {}

  static create(props: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }): KudosCategory {
    return new KudosCategory(
      props.id,
      props.name,
      props.description,
      props.icon,
      props.color,
      props.isActive,
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

  getDescription(): string {
    return this.description;
  }

  getIcon(): string {
    return this.icon;
  }

  getColor(): string {
    return this.color;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getCreatedAt(): string {
    return this.createdAt;
  }

  getUpdatedAt(): string {
    return this.updatedAt;
  }
  
  
} 
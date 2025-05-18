/**
 * ForgotPassword entity representing a password reset token
 */
export class ForgotPassword {
  private id: string;
  private userId: string;
  private email: string;
  private token: string;
  private expiresAt: Date;
  private isUsed: boolean;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(
    id: string,
    userId: string,
    email: string,
    token: string,
    expiresAt: Date,
    isUsed: boolean = false,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.userId = userId;
    this.email = email;
    this.token = token;
    this.expiresAt = expiresAt;
    this.isUsed = isUsed;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }


  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getEmail(): string {
    return this.email;
  }

  getToken(): string {
    return this.token;
  }

  getExpiresAt(): Date {
    return this.expiresAt;
  }

  getIsUsed(): boolean {
    return this.isUsed;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return !this.isExpired() && !this.isUsed;
  }
} 
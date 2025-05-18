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

  /**
   * Get the ID
   * @returns The ID
   */
  getId(): string {
    return this.id;
  }

  /**
   * Get the user ID
   * @returns The user ID
   */
  getUserId(): string {
    return this.userId;
  }

  /**
   * Get the email
   * @returns The email
   */
  getEmail(): string {
    return this.email;
  }

  /**
   * Get the token
   * @returns The token
   */
  getToken(): string {
    return this.token;
  }

  /**
   * Get the expiration date
   * @returns The expiration date
   */
  getExpiresAt(): Date {
    return this.expiresAt;
  }

  /**
   * Check if the token is used
   * @returns True if the token is used, false otherwise
   */
  getIsUsed(): boolean {
    return this.isUsed;
  }

  /**
   * Get the creation date
   * @returns The creation date
   */
  getCreatedAt(): Date {
    return this.createdAt;
  }

  /**
   * Get the update date
   * @returns The update date
   */
  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  /**
   * Check if the token is expired
   * @returns True if the token is expired, false otherwise
   */
  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  isValid(): boolean {
    return !this.isExpired() && !this.isUsed;
  }
} 
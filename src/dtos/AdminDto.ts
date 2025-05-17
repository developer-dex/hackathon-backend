export interface UserListItemDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  verificationStatus: string;
  createdAt: Date;
}

export interface UsersListResponse {
  users: UserListItemDTO[];
  pagination: {
    total: number;
    limit?: number;
    offset: number;
  };
} 
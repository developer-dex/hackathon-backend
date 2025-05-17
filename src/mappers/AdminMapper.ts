import { User } from "../domain/entities/User";
import { UserListItemDTO } from "../dtos/AdminDto";

export class AdminMapper {
  static toUserListItemDTO(user: User): UserListItemDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      verificationStatus: user.verificationStatus,
      createdAt: new Date(user.createdAt)
    };
  }

  static toUserListItemDTOList(users: User[]): UserListItemDTO[] {
    return users.map(user => this.toUserListItemDTO(user));
  }
} 
import { User } from "../domain/entities/User";
import { UserListItemDTO } from "../dtos/AdminDto";

export class AdminMapper {
  static toUserListItemDTO(user: User): UserListItemDTO {
    return {
      id: user.getId(),
      name: user.getName(),
      email: user.getEmail(),
      role: user.getRole(),
      verificationStatus: user.getVerificationStatus(),
      createdAt: new Date(user.getCreatedAt()),
      teamId: user.getTeamId()
    };
  }

  static toUserListItemDTOList(users: User[]): UserListItemDTO[] {
    return users.map(user => this.toUserListItemDTO(user));
  }
} 
import { UserDTO } from './UserDto';
import { KudosCategoryDTO } from './KudosCategoryDto';

export interface KudosDTO {
  id: string;
  sender: UserDTO;
  receiver: UserDTO;
  category: KudosCategoryDTO;
  message: string;
  teamName: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKudosDTO {
  senderId: string;
  receiverId: string;
  categoryId: string;
  message: string;
  teamName: string;
}

export interface KudosListItemDTO {
  id: string;
  sender: {
    id: string;
    name: string;
    department: string;
  };
  receiver: {
    id: string;
    name: string;
    department: string;
  };
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  message: string;
  teamName: string;
  createdAt: string;
} 
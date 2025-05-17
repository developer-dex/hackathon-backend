import { UserDTO } from './AuthDto';
import { KudosCategoryDTO } from './KudosCategoryDto';
import { TeamDTO } from './TeamDto';

export interface KudosDTO {
  id: string;
  sender: UserDTO;
  receiver: UserDTO;
  category: KudosCategoryDTO;
  team: TeamDTO;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKudosDTO {
  senderId: string;
  receiverId: string;
  categoryId: string;
  teamId: string;
  message: string;
}

export interface KudosListItemDTO {
  id: string;
  sender: {
    id: string;
    name: string;
    teamId: string;
  };
  receiver: {
    id: string;
    name: string;
    teamId: string;
  };
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  team: {
    id: string;
    name: string;
  };
  message: string;
  createdAt: string;
} 
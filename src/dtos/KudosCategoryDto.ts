export interface KudosCategoryDTO {
  id: string;
  name: string;
  description: string;
  icon: string;
  iconUrl: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateKudosCategoryDTO {
  name: string;
  description: string;
  icon: string;
  color: string;
}

export interface UpdateKudosCategoryDTO {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
} 
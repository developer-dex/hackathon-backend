import { Kudos } from '../../entities/Kudos';
import { CreateKudosDTO, KudosDTO, KudosListItemDTO } from '../../../dtos/KudosDto';

export interface KudosFilters {
  teamId?: string;
  categoryId?: string;
  senderId?: string;
  receiverId?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface IKudosRepository {
  createKudos(kudosData: CreateKudosDTO): Promise<Kudos | null>;
  getKudosById(id: string): Promise<Kudos | null>;
  getPopulatedKudos(id: string): Promise<KudosDTO | null>;
  getKudosBySender(senderId: string): Promise<Kudos[]>;
  getKudosByReceiver(receiverId: string): Promise<Kudos[]>;
  getAllKudos(limit?: number, offset?: number, filters?: KudosFilters): Promise<Kudos[]>;
  getAllKudosPopulated(limit?: number, offset?: number, filters?: KudosFilters): Promise<KudosListItemDTO[]>;
  getTotalCount(filters?: KudosFilters): Promise<number>;
} 
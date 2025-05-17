import { Kudos } from '../../entities/Kudos';
import { CreateKudosDTO, KudosDTO, KudosListItemDTO } from '../../../dtos/KudosDto';

export interface IKudosRepository {
  createKudos(kudosData: CreateKudosDTO): Promise<Kudos | null>;
  getKudosById(id: string): Promise<Kudos | null>;
  getPopulatedKudos(id: string): Promise<KudosDTO | null>;
  getKudosBySender(senderId: string): Promise<Kudos[]>;
  getKudosByReceiver(receiverId: string): Promise<Kudos[]>;
  getAllKudos(limit?: number, offset?: number): Promise<Kudos[]>;
  getAllKudosPopulated(limit?: number, offset?: number): Promise<KudosListItemDTO[]>;
  getTotalCount(): Promise<number>;
} 
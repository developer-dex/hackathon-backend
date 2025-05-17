import { Kudos } from '../entities/Kudos';
import { CreateKudosDTO } from '../../dtos/KudosDto';

export interface IKudosRepository {
  createKudos(kudosData: CreateKudosDTO): Promise<Kudos | null>;
  getKudosById(id: string): Promise<Kudos | null>;
  getKudosBySender(senderId: string): Promise<Kudos[]>;
  getKudosByReceiver(receiverId: string): Promise<Kudos[]>;
  getAllKudos(limit?: number, offset?: number): Promise<Kudos[]>;
  getTotalCount(): Promise<number>;
} 
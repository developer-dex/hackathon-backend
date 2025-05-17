import { IKudosRepository } from '../../domain/interfaces/repositories/KudosRepository';
import { Kudos } from '../../domain/entities/Kudos';
import { CreateKudosDTO, KudosDTO, KudosListItemDTO } from '../../dtos/KudosDto';
import { KudosModel } from '../database/models/KudosModel';
import { KudosMapper } from '../../mappers/KudosMapper';
import { UserModel } from '../database/models/UserModel';
import { KudosCategoryModel } from '../database/models/KudosCategoryModel';

export class KudosRepositoryImpl implements IKudosRepository {
  async createKudos(kudosData: CreateKudosDTO): Promise<Kudos | null> {
    try {
      const newKudos = new KudosModel(kudosData);
      const savedKudos = await newKudos.save();
      
      return KudosMapper.toDomain(savedKudos);
    } catch (error) {
      console.error('Error creating kudos:', error);
      return null;
    }
  }

  async getKudosById(id: string): Promise<Kudos | null> {
    try {
      const kudos = await KudosModel.findById(id);
      return KudosMapper.toDomain(kudos);
    } catch (error) {
      console.error('Error getting kudos by ID:', error);
      return null;
    }
  }

  async getPopulatedKudos(id: string): Promise<KudosDTO | null> {
    try {
      const kudos = await KudosModel.findById(id);
      if (!kudos) return null;

      const sender = await UserModel.findById(kudos.senderId);
      const receiver = await UserModel.findById(kudos.receiverId);
      const category = await KudosCategoryModel.findById(kudos.categoryId);

      if (!sender || !receiver || !category) return null;

      const kudosDomain = KudosMapper.toDomain(kudos);
      if (!kudosDomain) return null;

      return KudosMapper.toDTO(kudosDomain, sender, receiver, category);
    } catch (error) {
      console.error('Error getting populated kudos:', error);
      return null;
    }
  }

  async getKudosBySender(senderId: string): Promise<Kudos[]> {
    try {
      const kudos = await KudosModel.find({ senderId });
      return KudosMapper.toDomainList(kudos);
    } catch (error) {
      console.error('Error getting kudos by sender:', error);
      return [];
    }
  }

  async getKudosByReceiver(receiverId: string): Promise<Kudos[]> {
    try {
      const kudos = await KudosModel.find({ receiverId });
      return KudosMapper.toDomainList(kudos);
    } catch (error) {
      console.error('Error getting kudos by receiver:', error);
      return [];
    }
  }

  async getAllKudos(limit?: number, offset: number = 0): Promise<Kudos[]> {
    try {
      let query = KudosModel.find()
        .sort({ createdAt: -1 });
      
      if (offset) {
        query = query.skip(offset);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const kudos = await query;
      return KudosMapper.toDomainList(kudos);
    } catch (error) {
      console.error('Error getting all kudos:', error);
      return [];
    }
  }

  async getAllKudosPopulated(limit?: number, offset: number = 0): Promise<KudosListItemDTO[]> {
    try {
      let query = KudosModel.find()
        .sort({ createdAt: -1 });
      
      if (offset) {
        query = query.skip(offset);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const kudos = await query.exec();
      const result: KudosListItemDTO[] = [];

      for (const kudosDoc of kudos) {
        const sender = await UserModel.findById(kudosDoc.senderId);
        const receiver = await UserModel.findById(kudosDoc.receiverId);
        const category = await KudosCategoryModel.findById(kudosDoc.categoryId);

        if (sender && receiver && category) {
          const kudosDomain = KudosMapper.toDomain(kudosDoc);
          if (kudosDomain) {
            result.push(KudosMapper.toListItemDTO(kudosDomain, sender, receiver, category));
          }
        }
      }

      return result;
    } catch (error) {
      console.error('Error getting all populated kudos:', error);
      return [];
    }
  }

  async getTotalCount(): Promise<number> {
    try {
      return await KudosModel.countDocuments();
    } catch (error) {
      console.error('Error getting total count:', error);
      return 0;
    }
  }
} 
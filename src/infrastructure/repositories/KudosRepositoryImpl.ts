import { IKudosRepository, KudosFilters } from '../../domain/interfaces/repositories/KudosRepository';
import { Kudos } from '../../domain/entities/Kudos';
import { CreateKudosDTO, KudosDTO, KudosListItemDTO } from '../../dtos/KudosDto';
import { KudosModel } from '../database/models/KudosModel';
import { KudosMapper } from '../../mappers/KudosMapper';
import { UserModel } from '../database/models/UserModel';
import { KudosCategoryModel } from '../database/models/KudosCategoryModel';
import { TeamModel } from '../database/models/TeamModel';
import mongoose from 'mongoose';

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
      const team = await TeamModel.findById(kudos.teamId);

      if (!sender || !receiver || !category || !team) return null;

      const kudosDomain = KudosMapper.toDomain(kudos);
      if (!kudosDomain) return null;

      return KudosMapper.toDTO(kudosDomain, sender, receiver, category, team);
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

  async getAllKudos(limit?: number, offset: number = 0, filters?: KudosFilters): Promise<Kudos[]> {
    try {
      const query = this.buildQueryFilters(filters);
      
      let dbQuery = KudosModel.find(query)
        .sort({ createdAt: -1 });
      
      if (offset) {
        dbQuery = dbQuery.skip(offset);
      }

      if (limit) {
        dbQuery = dbQuery.limit(limit);
      }

      const kudos = await dbQuery;
      return KudosMapper.toDomainList(kudos);
    } catch (error) {
      console.error('Error getting all kudos:', error);
      return [];
    }
  }

  async getAllKudosPopulated(limit?: number, offset: number = 0, filters?: KudosFilters): Promise<KudosListItemDTO[]> {
    try {
      const query = this.buildQueryFilters(filters);
      
      let dbQuery = KudosModel.find(query)
        .sort({ createdAt: -1 });
      
      if (offset) {
        dbQuery = dbQuery.skip(offset);
      }

      if (limit) {
        dbQuery = dbQuery.limit(limit);
      }

      const kudos = await dbQuery.exec();
      const result: KudosListItemDTO[] = [];

      for (const kudosDoc of kudos) {
        const sender = await UserModel.findById(kudosDoc.senderId);
        const receiver = await UserModel.findById(kudosDoc.receiverId);
        const category = await KudosCategoryModel.findById(kudosDoc.categoryId);
        const team = await TeamModel.findById(kudosDoc.teamId);

        if (sender && receiver && category && team) {
          const kudosDomain = KudosMapper.toDomain(kudosDoc);
          if (kudosDomain) {
            result.push(KudosMapper.toListItemDTO(kudosDomain, sender, receiver, category, team));
          }
        }
      }

      return result;
    } catch (error) {
      console.error('Error getting all populated kudos:', error);
      return [];
    }
  }

  async getTotalCount(filters?: KudosFilters): Promise<number> {
    try {
      const query = this.buildQueryFilters(filters);
      return await KudosModel.countDocuments(query);
    } catch (error) {
      console.error('Error getting kudos count:', error);
      return 0;
    }
  }

  /**
   * Builds the MongoDB query based on provided filters
   * @param filters Optional filters for the query
   * @returns MongoDB query object
   */
  private buildQueryFilters(filters?: KudosFilters): Record<string, any> {
    const query: Record<string, any> = {};
    
    if (!filters) {
      return query;
    }
    
    if (filters.teamId) {
      query.teamId = new mongoose.Types.ObjectId(filters.teamId);
    }
    
    if (filters.categoryId) {
      query.categoryId = new mongoose.Types.ObjectId(filters.categoryId);
    }
    
    if (filters.senderId) {
      query.senderId = new mongoose.Types.ObjectId(filters.senderId);
    }
    
    if (filters.receiverId) {
      query.receiverId = new mongoose.Types.ObjectId(filters.receiverId);
    }
    
    // Add date range filtering
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      
      if (filters.startDate) {
        query.createdAt.$gte = filters.startDate;
      }
      
      if (filters.endDate) {
        query.createdAt.$lte = filters.endDate;
      }
    }
    
    return query;
  }
} 
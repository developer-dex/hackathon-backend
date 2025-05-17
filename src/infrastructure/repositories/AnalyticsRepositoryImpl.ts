import { IAnalyticsRepository } from '../../domain/interfaces/repositories/IAnalyticsRepository';
import { AnalyticsRequestDto, AnalyticsResponseDto, TimePeriod } from '../../dtos/AnalyticsDto';
import { KudosModel } from '../database/models/KudosModel';
import { UserModel } from '../database/models/UserModel';
import { TeamModel } from '../database/models/TeamModel';
import mongoose from 'mongoose';

export class AnalyticsRepositoryImpl implements IAnalyticsRepository {
  /**
   * Main method to get all analytics data based on the request parameters
   */
  async getAnalytics(request: AnalyticsRequestDto): Promise<AnalyticsResponseDto> {
    // Calculate date ranges based on time period
    const { startDate, endDate, prevStartDate, prevEndDate } = this.calculateDateRange(request);
    
    // Define limit for top N metrics
    const limit = request.limit || 5;
    
    // Get all required metrics concurrently
    const [
      topRecognizedIndividuals,
      topTeams,
      totalKudos,
      totalUsers,
      mostActiveDay,
      prevTotalKudos
    ] = await Promise.all([
      this.getTopReceivers(startDate, endDate, limit, request.teamId, request.categoryId),
      this.getTopTeams(startDate, endDate, limit, request.categoryId),
      this.getTotalKudosCount(startDate, endDate, request.teamId, request.categoryId),
      this.getTotalUsersCount(request.teamId),
      this.getMostActiveDay(startDate, endDate, request.teamId, request.categoryId),
      this.getTotalKudosCount(prevStartDate, prevEndDate, request.teamId, request.categoryId)
    ]);
    
    // Calculate average kudos per person
    const avgKudosPerPerson = totalUsers > 0 ? +(totalKudos / totalUsers).toFixed(1) : 0;
    
    // Calculate previous period average
    const prevAvgKudosPerPerson = totalUsers > 0 ? +(prevTotalKudos / totalUsers).toFixed(1) : 0;
    
    // Calculate percentage changes
    const totalKudosChange = prevTotalKudos === 0 
      ? 100 // If previous was 0, consider it 100% increase
      : +((totalKudos - prevTotalKudos) / prevTotalKudos * 100).toFixed(1);
    
    const avgKudosChange = prevAvgKudosPerPerson === 0 
      ? 100 // If previous was 0, consider it 100% increase
      : +((avgKudosPerPerson - prevAvgKudosPerPerson) / prevAvgKudosPerPerson * 100).toFixed(1);
    
    // Construct and return the full analytics response
    return {
      topRecognizedIndividuals,
      topTeams,
      totalKudos,
      avgKudosPerPerson,
      previousPeriodComparison: {
        totalKudos: {
          previous: prevTotalKudos,
          percentageChange: totalKudosChange
        },
        avgKudosPerPerson: {
          previous: prevAvgKudosPerPerson,
          percentageChange: avgKudosChange
        }
      },
      mostActiveDay,
      periodStart: startDate.toISOString(),
      periodEnd: endDate.toISOString()
    };
  }

  /**
   * Get total kudos count within a date range
   */
  async getTotalKudosCount(startDate: Date, endDate: Date, teamId?: string, categoryId?: string): Promise<number> {
    try {
      const query: any = {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      };
      
      if (teamId) {
        query.teamId = new mongoose.Types.ObjectId(teamId);
      }
      
      if (categoryId) {
        query.categoryId = new mongoose.Types.ObjectId(categoryId);
      }
      
      return await KudosModel.countDocuments(query);
    } catch (error) {
      console.error('Error getting total kudos count:', error);
      return 0;
    }
  }

  /**
   * Get top receivers of kudos within a date range
   */
  async getTopReceivers(startDate: Date, endDate: Date, limit: number, teamId?: string, categoryId?: string): Promise<{id: string, name: string, count: number}[]> {
    try {
      const matchStage: any = {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      };
      
      if (teamId) {
        matchStage.teamId = new mongoose.Types.ObjectId(teamId);
      }
      
      if (categoryId) {
        matchStage.categoryId = new mongoose.Types.ObjectId(categoryId);
      }

      const pipeline = [
        { $match: matchStage },
        { 
          $group: {
            _id: '$receiverId',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        { $unwind: '$userInfo' },
        {
          $project: {
            id: { $toString: '$_id' },
            name: '$userInfo.name',
            count: 1,
            _id: 0
          }
        }
      ];

      return await KudosModel.aggregate(pipeline as any);
    } catch (error) {
      console.error('Error getting top receivers:', error);
      return [];
    }
  }

  /**
   * Get top teams by kudos received within a date range
   */
  async getTopTeams(startDate: Date, endDate: Date, limit: number, categoryId?: string): Promise<{id: string, name: string, count: number}[]> {
    try {
      const matchStage: any = {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      };
      
      if (categoryId) {
        matchStage.categoryId = new mongoose.Types.ObjectId(categoryId);
      }

      const pipeline = [
        { $match: matchStage },
        { 
          $group: {
            _id: '$teamId',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'teams',
            localField: '_id',
            foreignField: '_id',
            as: 'teamInfo'
          }
        },
        { $unwind: '$teamInfo' },
        {
          $project: {
            id: { $toString: '$_id' },
            name: '$teamInfo.name',
            count: 1,
            _id: 0
          }
        }
      ];

      return await KudosModel.aggregate(pipeline as any);
    } catch (error) {
      console.error('Error getting top teams:', error);
      return [];
    }
  }

  /**
   * Get most active day of the week for kudos within a date range
   */
  async getMostActiveDay(startDate: Date, endDate: Date, teamId?: string, categoryId?: string): Promise<{day: string, count: number, percentage: number}> {
    try {
      const matchStage: any = {
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      };
      
      if (teamId) {
        matchStage.teamId = new mongoose.Types.ObjectId(teamId);
      }
      
      if (categoryId) {
        matchStage.categoryId = new mongoose.Types.ObjectId(categoryId);
      }

      const pipeline = [
        { $match: matchStage },
        { 
          $group: {
            _id: { $dayOfWeek: '$createdAt' }, // 1 for Sunday, 2 for Monday, etc.
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ];

      const result = await KudosModel.aggregate(pipeline as any);
      
      if (result.length === 0) {
        return { day: 'N/A', count: 0, percentage: 0 };
      }

      // Get total count for percentage calculation
      const totalCount = await KudosModel.countDocuments(matchStage);
      
      // Map day number to day name
      const dayMapping = ["", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const dayName = dayMapping[result[0]._id];
      
      // Calculate percentage
      const percentage = totalCount > 0 ? Math.round((result[0].count / totalCount) * 100) : 0;
      
      return {
        day: dayName,
        count: result[0].count,
        percentage
      };
    } catch (error) {
      console.error('Error getting most active day:', error);
      return { day: 'N/A', count: 0, percentage: 0 };
    }
  }

  /**
   * Get total number of users (for average calculation)
   */
  async getTotalUsersCount(teamId?: string): Promise<number> {
    try {
      const query = teamId ? { teamId: new mongoose.Types.ObjectId(teamId) } : {};
      return await UserModel.countDocuments(query);
    } catch (error) {
      console.error('Error getting total users count:', error);
      return 0;
    }
  }

  /**
   * Calculate date ranges based on the requested time period
   */
  private calculateDateRange(request: AnalyticsRequestDto): { 
    startDate: Date; 
    endDate: Date; 
    prevStartDate: Date; 
    prevEndDate: Date; 
  } {
    // If custom dates are provided, use them
    if (request.startDate && request.endDate) {
      const startDate = new Date(request.startDate);
      const endDate = new Date(request.endDate);
      
      // Calculate same duration for previous period
      const duration = endDate.getTime() - startDate.getTime();
      const prevEndDate = new Date(startDate);
      const prevStartDate = new Date(prevEndDate.getTime() - duration);
      
      return { startDate, endDate, prevStartDate, prevEndDate };
    }
    
    // Set date ranges based on time period
    const now = new Date();
    const endDate = new Date(now);
    endDate.setHours(23, 59, 59, 999); // End of current day
    
    let startDate: Date;
    let prevStartDate: Date;
    let prevEndDate: Date;
    
    switch (request.timePeriod) {
      case TimePeriod.WEEKLY:
        // Start from beginning of current week (Sunday)
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        
        // Previous week
        prevEndDate = new Date(startDate);
        prevEndDate.setDate(prevEndDate.getDate() - 1);
        prevEndDate.setHours(23, 59, 59, 999);
        
        prevStartDate = new Date(prevEndDate);
        prevStartDate.setDate(prevStartDate.getDate() - 6);
        prevStartDate.setHours(0, 0, 0, 0);
        break;
        
      case TimePeriod.MONTHLY:
        // Start from beginning of current month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        
        // Previous month
        prevEndDate = new Date(startDate);
        prevEndDate.setDate(prevEndDate.getDate() - 1);
        
        prevStartDate = new Date(prevEndDate.getFullYear(), prevEndDate.getMonth(), 1);
        break;
        
      case TimePeriod.QUARTERLY:
        // Start from beginning of current quarter
        const currentQuarter = Math.floor(now.getMonth() / 3);
        startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
        
        // Previous quarter
        prevEndDate = new Date(startDate);
        prevEndDate.setDate(prevEndDate.getDate() - 1);
        
        const prevQuarter = (currentQuarter + 3) % 4; // Going back one quarter
        const prevYear = prevQuarter > currentQuarter ? now.getFullYear() - 1 : now.getFullYear();
        prevStartDate = new Date(prevYear, prevQuarter * 3, 1);
        break;
        
      case TimePeriod.YEARLY:
        // Start from beginning of current year
        startDate = new Date(now.getFullYear(), 0, 1);
        
        // Previous year
        prevEndDate = new Date(now.getFullYear() - 1, 11, 31);
        prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
        break;
        
      default:
        // Default to monthly if somehow an invalid period gets through
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        prevEndDate = new Date(startDate);
        prevEndDate.setDate(prevEndDate.getDate() - 1);
        prevStartDate = new Date(prevEndDate.getFullYear(), prevEndDate.getMonth(), 1);
    }
    
    return { startDate, endDate, prevStartDate, prevEndDate };
  }
} 
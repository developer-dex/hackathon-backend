import { AnalyticsRequestDto, AnalyticsResponseDto } from "../../../dtos/AnalyticsDto";

export interface IAnalyticsRepository {
  getAnalytics(request: AnalyticsRequestDto): Promise<AnalyticsResponseDto>;
  getTotalKudosCount(startDate: Date, endDate: Date, teamId?: string, categoryId?: string): Promise<number>;
  getTopReceivers(startDate: Date, endDate: Date, limit: number, teamId?: string, categoryId?: string): Promise<{id: string, name: string, count: number}[]>;
  getTopTeams(startDate: Date, endDate: Date, limit: number, categoryId?: string): Promise<{id: string, name: string, count: number}[]>;
  getMostActiveDay(startDate: Date, endDate: Date, teamId?: string, categoryId?: string): Promise<{day: string, count: number, percentage: number}>;
  getTotalUsersCount(teamId?: string): Promise<number>;
} 
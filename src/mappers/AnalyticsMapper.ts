import { AnalyticsResponseDto, RecognizedIndividual, TeamAnalytics, TrendingCategory, DayActivity } from '../dtos/AnalyticsDto';
import { Analytics } from '../domain/entities/Analytics';

/**
 * AnalyticsMapper - Responsible for transforming analytics data
 * to ensure consistent format and structure across the application
 */
export class AnalyticsMapper {
  /**
   * Map from Analytics domain entity to AnalyticsResponseDto
   */
  public static toDTO(analytics: Analytics): AnalyticsResponseDto {
    return {
      topRecognizedIndividuals: analytics.getTopRecognizedIndividuals(),
      topTrendingCategories: analytics.getTopTrendingCategories(),
      topTeams: analytics.getTopTeams(),
      totalKudos: analytics.getTotalKudos(),
      avgKudosPerPerson: analytics.getAvgKudosPerPerson(),
      previousPeriodComparison: {
        totalKudos: {
          previous: analytics.getPreviousTotalKudos(),
          percentageChange: analytics.getTotalKudosPercentageChange()
        },
        avgKudosPerPerson: {
          previous: analytics.getPreviousAvgKudosPerPerson(),
          percentageChange: analytics.getAvgKudosPerPersonPercentageChange()
        }
      },
      mostActiveDay: analytics.getMostActiveDay(),
      periodStart: analytics.getPeriodStart(),
      periodEnd: analytics.getPeriodEnd()
    };
  }

  /**
   * Map from raw data to Analytics domain entity
   */
  public static toDomain(params: {
    topRecognizedIndividuals: RecognizedIndividual[];
    topTrendingCategories: TrendingCategory[];
    topTeams: TeamAnalytics[];
    totalKudos: number;
    avgKudosPerPerson: number;
    previousPeriodComparison: {
      totalKudos: {
        previous: number;
        percentageChange: number;
      };
      avgKudosPerPerson: {
        previous: number;
        percentageChange: number;
      };
    };
    mostActiveDay: DayActivity;
    periodStart: string;
    periodEnd: string;
  }): Analytics {
    return Analytics.create({
      topRecognizedIndividuals: params.topRecognizedIndividuals,
      topTrendingCategories: params.topTrendingCategories,
      topTeams: params.topTeams,
      totalKudos: params.totalKudos,
      avgKudosPerPerson: params.avgKudosPerPerson,
      previousTotalKudos: params.previousPeriodComparison.totalKudos.previous,
      previousAvgKudosPerPerson: params.previousPeriodComparison.avgKudosPerPerson.previous,
      totalKudosPercentageChange: params.previousPeriodComparison.totalKudos.percentageChange,
      avgKudosPerPersonPercentageChange: params.previousPeriodComparison.avgKudosPerPerson.percentageChange,
      mostActiveDay: params.mostActiveDay,
      periodStart: params.periodStart,
      periodEnd: params.periodEnd
    });
  }
} 
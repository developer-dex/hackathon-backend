import { DayActivity, RecognizedIndividual, TeamAnalytics, TrendingCategory } from "../../dtos/AnalyticsDto";

/**
 * Analytics - Core domain entity representing analytics data
 */
export class Analytics {
  private constructor(
    public readonly topRecognizedIndividuals: RecognizedIndividual[],
    public readonly topTrendingCategories: TrendingCategory[],
    public readonly topTeams: TeamAnalytics[],
    public readonly totalKudos: number,
    public readonly avgKudosPerPerson: number,
    public readonly previousTotalKudos: number,
    public readonly previousAvgKudosPerPerson: number,
    public readonly totalKudosPercentageChange: number,
    public readonly avgKudosPerPersonPercentageChange: number,
    public readonly mostActiveDay: DayActivity,
    public readonly periodStart: string,
    public readonly periodEnd: string
  ) {}

  static create(props: {
    topRecognizedIndividuals: RecognizedIndividual[];
    topTrendingCategories: TrendingCategory[];
    topTeams: TeamAnalytics[];
    totalKudos: number;
    avgKudosPerPerson: number;
    previousTotalKudos: number;
    previousAvgKudosPerPerson: number;
    totalKudosPercentageChange: number;
    avgKudosPerPersonPercentageChange: number;
    mostActiveDay: DayActivity;
    periodStart: string;
    periodEnd: string;
  }): Analytics {
    return new Analytics(
      props.topRecognizedIndividuals,
      props.topTrendingCategories,
      props.topTeams,
      props.totalKudos,
      props.avgKudosPerPerson,
      props.previousTotalKudos,
      props.previousAvgKudosPerPerson,
      props.totalKudosPercentageChange,
      props.avgKudosPerPersonPercentageChange,
      props.mostActiveDay,
      props.periodStart,
      props.periodEnd
    );
  }

  getTopRecognizedIndividuals(): RecognizedIndividual[] {
    return this.topRecognizedIndividuals;
  }

  getTopTrendingCategories(): TrendingCategory[] {
    return this.topTrendingCategories;
  }

  getTopTeams(): TeamAnalytics[] {
    return this.topTeams;
  }

  getTotalKudos(): number {
    return this.totalKudos;
  }

  getAvgKudosPerPerson(): number {
    return this.avgKudosPerPerson;
  }

  getPreviousTotalKudos(): number {
    return this.previousTotalKudos;
  }

  getPreviousAvgKudosPerPerson(): number {
    return this.previousAvgKudosPerPerson;
  }

  getTotalKudosPercentageChange(): number {
    return this.totalKudosPercentageChange;
  }

  getAvgKudosPerPersonPercentageChange(): number {
    return this.avgKudosPerPersonPercentageChange;
  }

  getMostActiveDay(): DayActivity {
    return this.mostActiveDay;
  }

  getPeriodStart(): string {
    return this.periodStart;
  }

  getPeriodEnd(): string {
    return this.periodEnd;
  }
} 
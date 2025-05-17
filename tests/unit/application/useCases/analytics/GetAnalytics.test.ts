import { GetAnalytics } from '../../../../../src/application/useCases/analytics/GetAnalytics';
import { IAnalyticsRepository } from '../../../../../src/domain/interfaces/repositories/IAnalyticsRepository';
import { AnalyticsRequestDto, AnalyticsResponseDto, TimePeriod } from '../../../../../src/dtos/AnalyticsDto';
import { ResponseMapper } from '../../../../../src/mappers/ResponseMapper';

// Mock dependencies
const mockAnalyticsRepository: jest.Mocked<IAnalyticsRepository> = {
  getAnalytics: jest.fn(),
  getTotalKudosCount: jest.fn(),
  getTopReceivers: jest.fn(),
  getTopTeams: jest.fn(),
  getMostActiveDay: jest.fn(),
  getTotalUsersCount: jest.fn()
};

// Mock analytics data
const mockAnalyticsRequest: AnalyticsRequestDto = {
  timePeriod: TimePeriod.MONTHLY,
  teamId: 'team-123',
  limit: 5
};

const mockAnalyticsResponse: AnalyticsResponseDto = {
  topRecognizedIndividuals: [
    { id: 'user-123', name: 'John Doe', count: 10 },
    { id: 'user-456', name: 'Jane Smith', count: 8 }
  ],
  topTeams: [
    { id: 'team-123', name: 'Engineering Team', count: 25 },
    { id: 'team-456', name: 'Marketing Team', count: 15 }
  ],
  totalKudos: 50,
  avgKudosPerPerson: 2.5,
  previousPeriodComparison: {
    totalKudos: {
      previous: 40,
      percentageChange: 25 // (50-40)/40 * 100
    },
    avgKudosPerPerson: {
      previous: 2.0,
      percentageChange: 25 // (2.5-2.0)/2.0 * 100
    }
  },
  mostActiveDay: {
    day: 'Monday',
    count: 15,
    percentage: 30 // 15/50 * 100
  },
  periodStart: '2023-01-01T00:00:00.000Z',
  periodEnd: '2023-01-31T23:59:59.999Z'
};

// Test GetAnalytics use case
describe('GetAnalytics Use Case', () => {
  let getAnalytics: GetAnalytics;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked repository
    getAnalytics = new GetAnalytics(mockAnalyticsRepository);
  });
  
  it('should successfully retrieve analytics data', async () => {
    // Arrange
    mockAnalyticsRepository.getAnalytics.mockResolvedValue(mockAnalyticsResponse);
    
    // Act
    const result = await getAnalytics.execute(mockAnalyticsRequest);
    
    // Assert
    expect(mockAnalyticsRepository.getAnalytics).toHaveBeenCalledWith(mockAnalyticsRequest);
    expect(result).toEqual(
      ResponseMapper.success(
        mockAnalyticsResponse,
        'Analytics data retrieved successfully'
      )
    );
  });
  
  it('should handle exceptions and return server error', async () => {
    // Arrange
    const error = new Error('Database connection error');
    mockAnalyticsRepository.getAnalytics.mockRejectedValue(error);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await getAnalytics.execute(mockAnalyticsRequest);
    
    // Assert
    expect(mockAnalyticsRepository.getAnalytics).toHaveBeenCalledWith(mockAnalyticsRequest);
    expect(serverErrorSpy).toHaveBeenCalledWith(error);
  });
  
  it('should handle unknown errors and convert them to Error objects', async () => {
    // Arrange
    const unknownError = 'This is a string error, not an Error object';
    mockAnalyticsRepository.getAnalytics.mockRejectedValue(unknownError);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await getAnalytics.execute(mockAnalyticsRequest);
    
    // Assert
    expect(mockAnalyticsRepository.getAnalytics).toHaveBeenCalledWith(mockAnalyticsRequest);
    expect(serverErrorSpy).toHaveBeenCalledWith(new Error('Unknown error'));
  });
}); 
import { GetAllTeams } from '../../../../../src/application/useCases/team/GetAllTeams';
import { ITeamRepository } from '../../../../../src/domain/interfaces/repositories/TeamRepository';
import { Team } from '../../../../../src/domain/entities/Team';
import { TeamDTO } from '../../../../../src/dtos/TeamDto';
import { ResponseMapper } from '../../../../../src/mappers/ResponseMapper';
import { TeamMapper } from '../../../../../src/mappers/TeamMapper';

// Mock dependencies
const mockTeamRepository: jest.Mocked<ITeamRepository> = {
  createTeam: jest.fn(),
  getTeamById: jest.fn(),
  getAllTeams: jest.fn(),
  updateTeam: jest.fn(),
  deleteTeam: jest.fn()
};

// Mock team data
const mockTeam1Props = {
  id: 'team-123',
  name: 'Engineering Team',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const mockTeam2Props = {
  id: 'team-456',
  name: 'Marketing Team',
  createdAt: '2023-01-02T00:00:00.000Z',
  updatedAt: '2023-01-02T00:00:00.000Z'
};

const mockTeam1 = Team.create(mockTeam1Props);
const mockTeam2 = Team.create(mockTeam2Props);

// Mock team DTOs
const mockTeam1DTO: TeamDTO = {
  id: 'team-123',
  name: 'Engineering Team',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const mockTeam2DTO: TeamDTO = {
  id: 'team-456',
  name: 'Marketing Team',
  createdAt: '2023-01-02T00:00:00.000Z',
  updatedAt: '2023-01-02T00:00:00.000Z'
};

// Test GetAllTeams use case
describe('GetAllTeams Use Case', () => {
  let getAllTeams: GetAllTeams;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked repository
    getAllTeams = new GetAllTeams(mockTeamRepository);
    
    // Mock the TeamMapper.toDTO method
    jest.spyOn(TeamMapper, 'toDTO')
      .mockImplementation((team) => {
        if (team.getId() === mockTeam1.getId()) {
          return mockTeam1DTO;
        } else if (team.getId() === mockTeam2.getId()) {
          return mockTeam2DTO;
        }
        return {} as TeamDTO;
      });
  });
  
  it('should successfully retrieve all teams', async () => {
    // Arrange
    const mockTeams = [mockTeam1, mockTeam2];
    const mockTeamDTOs = [mockTeam1DTO, mockTeam2DTO];
    
    // Mock repository responses
    mockTeamRepository.getAllTeams.mockResolvedValue(mockTeams);
    
    // Act
    const result = await getAllTeams.execute();
    
    // Assert
    expect(mockTeamRepository.getAllTeams).toHaveBeenCalled();
    expect(TeamMapper.toDTO).toHaveBeenCalledTimes(2);
    expect(result).toEqual(
      ResponseMapper.success(
        mockTeamDTOs,
        `Retrieved ${mockTeamDTOs.length} teams successfully`
      )
    );
  });
  
  it('should return empty array when no teams exist', async () => {
    // Arrange
    const emptyTeams: Team[] = [];
    
    // Mock repository responses
    mockTeamRepository.getAllTeams.mockResolvedValue(emptyTeams);
    
    // Act
    const result = await getAllTeams.execute();
    
    // Assert
    expect(mockTeamRepository.getAllTeams).toHaveBeenCalled();
    expect(TeamMapper.toDTO).not.toHaveBeenCalled();
    expect(result).toEqual(
      ResponseMapper.success(
        [],
        'Retrieved 0 teams successfully'
      )
    );
  });
  
  it('should handle exceptions and return server error', async () => {
    // Arrange
    const error = new Error('Database connection error');
    
    // Mock repository responses to throw error
    mockTeamRepository.getAllTeams.mockRejectedValue(error);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await getAllTeams.execute();
    
    // Assert
    expect(mockTeamRepository.getAllTeams).toHaveBeenCalled();
    expect(TeamMapper.toDTO).not.toHaveBeenCalled();
    expect(serverErrorSpy).toHaveBeenCalledWith(error);
  });
}); 
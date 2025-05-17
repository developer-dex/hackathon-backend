import { GetTeamById } from '../../../../../src/application/useCases/team/GetTeamById';
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
const mockTeamProps = {
  id: 'team-123',
  name: 'Engineering Team',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const mockTeam = Team.create(mockTeamProps);

// Mock team DTO
const mockTeamDTO: TeamDTO = {
  id: 'team-123',
  name: 'Engineering Team',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

// Test GetTeamById use case
describe('GetTeamById Use Case', () => {
  let getTeamById: GetTeamById;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked repository
    getTeamById = new GetTeamById(mockTeamRepository);
    
    // Mock the TeamMapper.toDTO method
    jest.spyOn(TeamMapper, 'toDTO').mockReturnValue(mockTeamDTO);
  });
  
  it('should successfully retrieve a team by ID', async () => {
    // Arrange
    const teamId = 'team-123';
    
    // Mock repository responses
    mockTeamRepository.getTeamById.mockResolvedValue(mockTeam);
    
    // Act
    const result = await getTeamById.execute(teamId);
    
    // Assert
    expect(mockTeamRepository.getTeamById).toHaveBeenCalledWith(teamId);
    expect(TeamMapper.toDTO).toHaveBeenCalledWith(mockTeam);
    expect(result).toEqual(
      ResponseMapper.success(
        mockTeamDTO,
        'Team retrieved successfully'
      )
    );
  });
  
  it('should return not found when team does not exist', async () => {
    // Arrange
    const teamId = 'nonexistent-team';
    
    // Mock repository responses
    mockTeamRepository.getTeamById.mockResolvedValue(null);
    
    // Act
    const result = await getTeamById.execute(teamId);
    
    // Assert
    expect(mockTeamRepository.getTeamById).toHaveBeenCalledWith(teamId);
    expect(TeamMapper.toDTO).not.toHaveBeenCalled();
    expect(result).toEqual(ResponseMapper.notFound('Team'));
  });
  
  it('should handle exceptions and return server error', async () => {
    // Arrange
    const teamId = 'team-123';
    const error = new Error('Database connection error');
    
    // Mock repository responses to throw error
    mockTeamRepository.getTeamById.mockRejectedValue(error);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await getTeamById.execute(teamId);
    
    // Assert
    expect(mockTeamRepository.getTeamById).toHaveBeenCalledWith(teamId);
    expect(TeamMapper.toDTO).not.toHaveBeenCalled();
    expect(serverErrorSpy).toHaveBeenCalledWith(error);
  });
}); 
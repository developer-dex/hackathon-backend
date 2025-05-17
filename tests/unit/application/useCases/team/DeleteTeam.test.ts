import { DeleteTeam } from '../../../../../src/application/useCases/team/DeleteTeam';
import { ITeamRepository } from '../../../../../src/domain/interfaces/repositories/TeamRepository';
import { Team } from '../../../../../src/domain/entities/Team';
import { ResponseMapper } from '../../../../../src/mappers/ResponseMapper';

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

// Test DeleteTeam use case
describe('DeleteTeam Use Case', () => {
  let deleteTeam: DeleteTeam;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked repository
    deleteTeam = new DeleteTeam(mockTeamRepository);
  });
  
  it('should successfully delete a team with valid ID', async () => {
    // Arrange
    const teamId = 'team-123';
    
    // Mock repository responses
    mockTeamRepository.getTeamById.mockResolvedValue(mockTeam);
    mockTeamRepository.deleteTeam.mockResolvedValue(true);
    
    // Act
    const result = await deleteTeam.execute(teamId);
    
    // Assert
    expect(mockTeamRepository.getTeamById).toHaveBeenCalledWith(teamId);
    expect(mockTeamRepository.deleteTeam).toHaveBeenCalledWith(teamId);
    expect(result).toEqual(
      ResponseMapper.success(
        true,
        'Team deleted successfully'
      )
    );
  });
  
  it('should return not found when team does not exist', async () => {
    // Arrange
    const teamId = 'nonexistent-team';
    
    // Mock repository responses
    mockTeamRepository.getTeamById.mockResolvedValue(null);
    
    // Act
    const result = await deleteTeam.execute(teamId);
    
    // Assert
    expect(mockTeamRepository.getTeamById).toHaveBeenCalledWith(teamId);
    expect(mockTeamRepository.deleteTeam).not.toHaveBeenCalled();
    expect(result).toEqual(ResponseMapper.notFound('Team'));
  });
  
  it('should return server error when team deletion fails', async () => {
    // Arrange
    const teamId = 'team-123';
    
    // Mock repository responses
    mockTeamRepository.getTeamById.mockResolvedValue(mockTeam);
    mockTeamRepository.deleteTeam.mockResolvedValue(false);
    
    // Act
    const result = await deleteTeam.execute(teamId);
    
    // Assert
    expect(mockTeamRepository.getTeamById).toHaveBeenCalledWith(teamId);
    expect(mockTeamRepository.deleteTeam).toHaveBeenCalledWith(teamId);
    expect(result).toEqual(
      ResponseMapper.serverError(new Error('Failed to delete team'))
    );
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
    const result = await deleteTeam.execute(teamId);
    
    // Assert
    expect(mockTeamRepository.getTeamById).toHaveBeenCalledWith(teamId);
    expect(mockTeamRepository.deleteTeam).not.toHaveBeenCalled();
    expect(serverErrorSpy).toHaveBeenCalledWith(error);
  });
}); 
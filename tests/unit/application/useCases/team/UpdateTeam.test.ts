import { UpdateTeam } from '../../../../../src/application/useCases/team/UpdateTeam';
import { ITeamRepository } from '../../../../../src/domain/interfaces/repositories/TeamRepository';
import { Team } from '../../../../../src/domain/entities/Team';
import { CreateTeamDTO, TeamDTO } from '../../../../../src/dtos/TeamDto';
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

// Mock updated team data
const mockUpdatedTeamProps = {
  id: 'team-123',
  name: 'Updated Engineering Team',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-02T00:00:00.000Z'
};

const mockUpdatedTeam = Team.create(mockUpdatedTeamProps);

// Mock team DTO
const mockTeamDTO: TeamDTO = {
  id: 'team-123',
  name: 'Updated Engineering Team',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-02T00:00:00.000Z'
};

// Test UpdateTeam use case
describe('UpdateTeam Use Case', () => {
  let updateTeam: UpdateTeam;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked repository
    updateTeam = new UpdateTeam(mockTeamRepository);
    
    // Mock the TeamMapper.toDTO method
    jest.spyOn(TeamMapper, 'toDTO').mockReturnValue(mockTeamDTO);
  });
  
  it('should successfully update a team with valid data', async () => {
    // Arrange
    const teamId = 'team-123';
    const updateTeamDto: Partial<CreateTeamDTO> = {
      name: 'Updated Engineering Team'
    };
    
    // Mock repository responses
    mockTeamRepository.getTeamById.mockResolvedValue(mockTeam);
    mockTeamRepository.updateTeam.mockResolvedValue(mockUpdatedTeam);
    
    // Act
    const result = await updateTeam.execute(teamId, updateTeamDto);
    
    // Assert
    expect(mockTeamRepository.getTeamById).toHaveBeenCalledWith(teamId);
    expect(mockTeamRepository.updateTeam).toHaveBeenCalledWith(teamId, updateTeamDto);
    expect(TeamMapper.toDTO).toHaveBeenCalledWith(mockUpdatedTeam);
    expect(result).toEqual(
      ResponseMapper.success(
        mockTeamDTO,
        'Team updated successfully'
      )
    );
  });
  
  it('should return not found when team does not exist', async () => {
    // Arrange
    const teamId = 'nonexistent-team';
    const updateTeamDto: Partial<CreateTeamDTO> = {
      name: 'Updated Engineering Team'
    };
    
    // Mock repository responses
    mockTeamRepository.getTeamById.mockResolvedValue(null);
    
    // Act
    const result = await updateTeam.execute(teamId, updateTeamDto);
    
    // Assert
    expect(mockTeamRepository.getTeamById).toHaveBeenCalledWith(teamId);
    expect(mockTeamRepository.updateTeam).not.toHaveBeenCalled();
    expect(TeamMapper.toDTO).not.toHaveBeenCalled();
    expect(result).toEqual(ResponseMapper.notFound('Team'));
  });
  
  it('should return server error when team update fails', async () => {
    // Arrange
    const teamId = 'team-123';
    const updateTeamDto: Partial<CreateTeamDTO> = {
      name: 'Updated Engineering Team'
    };
    
    // Mock repository responses
    mockTeamRepository.getTeamById.mockResolvedValue(mockTeam);
    mockTeamRepository.updateTeam.mockResolvedValue(null);
    
    // Act
    const result = await updateTeam.execute(teamId, updateTeamDto);
    
    // Assert
    expect(mockTeamRepository.getTeamById).toHaveBeenCalledWith(teamId);
    expect(mockTeamRepository.updateTeam).toHaveBeenCalledWith(teamId, updateTeamDto);
    expect(TeamMapper.toDTO).not.toHaveBeenCalled();
    expect(result).toEqual(
      ResponseMapper.serverError(new Error('Failed to update team'))
    );
  });
  
  it('should handle exceptions and return server error', async () => {
    // Arrange
    const teamId = 'team-123';
    const updateTeamDto: Partial<CreateTeamDTO> = {
      name: 'Updated Engineering Team'
    };
    const error = new Error('Database connection error');
    
    // Mock repository responses to throw error
    mockTeamRepository.getTeamById.mockRejectedValue(error);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await updateTeam.execute(teamId, updateTeamDto);
    
    // Assert
    expect(mockTeamRepository.getTeamById).toHaveBeenCalledWith(teamId);
    expect(mockTeamRepository.updateTeam).not.toHaveBeenCalled();
    expect(TeamMapper.toDTO).not.toHaveBeenCalled();
    expect(serverErrorSpy).toHaveBeenCalledWith(error);
  });
}); 
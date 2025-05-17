import { CreateTeam } from '../../../../../src/application/useCases/team/CreateTeam';
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

// Mock team DTO
const mockTeamDTO: TeamDTO = {
  id: 'team-123',
  name: 'Engineering Team',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

// Test CreateTeam use case
describe('CreateTeam Use Case', () => {
  let createTeam: CreateTeam;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked repository
    createTeam = new CreateTeam(mockTeamRepository);
    
    // Mock the TeamMapper.toDTO method
    jest.spyOn(TeamMapper, 'toDTO').mockReturnValue(mockTeamDTO);
  });
  
  it('should successfully create a team with valid data', async () => {
    // Arrange
    const createTeamDto: CreateTeamDTO = {
      name: 'Engineering Team'
    };
    
    // Mock repository responses
    mockTeamRepository.createTeam.mockResolvedValue(mockTeam);
    
    // Act
    const result = await createTeam.execute(createTeamDto);
    
    // Assert
    expect(mockTeamRepository.createTeam).toHaveBeenCalledWith(createTeamDto);
    expect(TeamMapper.toDTO).toHaveBeenCalledWith(mockTeam);
    expect(result).toEqual(
      ResponseMapper.success(
        mockTeamDTO,
        'Team created successfully'
      )
    );
  });
  
  it('should return server error when team creation fails', async () => {
    // Arrange
    const createTeamDto: CreateTeamDTO = {
      name: 'Engineering Team'
    };
    
    // Mock repository responses
    mockTeamRepository.createTeam.mockResolvedValue(null);
    
    // Act
    const result = await createTeam.execute(createTeamDto);
    
    // Assert
    expect(mockTeamRepository.createTeam).toHaveBeenCalledWith(createTeamDto);
    expect(TeamMapper.toDTO).not.toHaveBeenCalled();
    expect(result).toEqual(
      ResponseMapper.serverError(new Error('Failed to create team'))
    );
  });
  
  it('should handle exceptions and return server error', async () => {
    // Arrange
    const createTeamDto: CreateTeamDTO = {
      name: 'Engineering Team'
    };
    
    const error = new Error('Database connection error');
    
    // Mock repository responses to throw error
    mockTeamRepository.createTeam.mockRejectedValue(error);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await createTeam.execute(createTeamDto);
    
    // Assert
    expect(mockTeamRepository.createTeam).toHaveBeenCalledWith(createTeamDto);
    expect(TeamMapper.toDTO).not.toHaveBeenCalled();
    expect(serverErrorSpy).toHaveBeenCalledWith(error);
  });
}); 
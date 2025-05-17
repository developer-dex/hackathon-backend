import { Signup } from '../../../../../src/application/useCases/auth/Signup';
import { IUserRepository } from '../../../../../src/domain/interfaces/repositories/IUserRepository';
import { ITeamRepository } from '../../../../../src/domain/interfaces/repositories/TeamRepository';
import { User, VerificationStatus, EUserRole } from '../../../../../src/domain/entities/User';
import { Team } from '../../../../../src/domain/entities/Team';
import { SignupRequestDto, UserDTO } from '../../../../../src/dtos/AuthDto';
import { ResponseMapper } from '../../../../../src/mappers/ResponseMapper';
import { UserMapper } from '../../../../../src/mappers/UserMapper';

// Mock dependencies
const mockUserRepository: jest.Mocked<IUserRepository> = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  createUser: jest.fn(),
  verifyPassword: jest.fn(),
  generateToken: jest.fn(),
  verifyToken: jest.fn()
};

const mockTeamRepository: jest.Mocked<ITeamRepository> = {
  createTeam: jest.fn(),
  getTeamById: jest.fn(),
  getAllTeams: jest.fn(),
  updateTeam: jest.fn(),
  deleteTeam: jest.fn()
};

// Mock team data
const mockTeamProps = {
  id: '456',
  name: 'Test Team',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const mockTeam = Team.create(mockTeamProps);

// Mock user props for User.create
const mockUserProps = {
  id: '123',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  role: EUserRole.TEAM_MEMBER,
  teamId: '456',
  verificationStatus: VerificationStatus.PENDING,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

// Create mock User instance
const mockUser = User.create(mockUserProps);

// Mock user DTO
const mockUserDTO: UserDTO = {
  id: '123',
  name: 'Test User',
  email: 'test@example.com',
  role: EUserRole.TEAM_MEMBER,
  teamId: '456',
  verificationStatus: VerificationStatus.PENDING,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

// Test Signup use case
describe('Signup Use Case', () => {
  let signup: Signup;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked repositories
    signup = new Signup(mockUserRepository, mockTeamRepository);
    
    // Mock the UserMapper.toDTO method
    jest.spyOn(UserMapper, 'toDTO').mockReturnValue(mockUserDTO);
  });
  
  it('should successfully register a user with valid data', async () => {
    // Arrange
    const signupDto: SignupRequestDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: EUserRole.TEAM_MEMBER,
      teamId: '456'
    };
    
    // Mock repository responses
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockTeamRepository.getTeamById.mockResolvedValue(mockTeam);
    mockUserRepository.createUser.mockResolvedValue(mockUser);
    
    // Act
    const result = await signup.execute(signupDto);
    
    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(signupDto.email);
    expect(mockTeamRepository.getTeamById).toHaveBeenCalledWith(signupDto.teamId);
    expect(mockUserRepository.createUser).toHaveBeenCalledWith(signupDto);
    expect(UserMapper.toDTO).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(
      ResponseMapper.success(
        {
          ...mockUserDTO,
          team: {
            id: mockTeam.id,
            name: mockTeam.name
          }
        },
        'User registered successfully. Verification status is pending.'
      )
    );
  });
  
  it('should return validation error when passwords do not match', async () => {
    // Arrange
    const signupDto: SignupRequestDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password456',
      role: EUserRole.TEAM_MEMBER,
      teamId: '456'
    };
    
    // Act
    const result = await signup.execute(signupDto);
    
    // Assert
    expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    expect(mockTeamRepository.getTeamById).not.toHaveBeenCalled();
    expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    expect(result).toEqual(ResponseMapper.validationError('Passwords do not match'));
  });
  
  it('should return validation error when email already exists', async () => {
    // Arrange
    const signupDto: SignupRequestDto = {
      name: 'Test User',
      email: 'existing@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: EUserRole.TEAM_MEMBER,
      teamId: '456'
    };
    
    // Mock repository responses
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    
    // Act
    const result = await signup.execute(signupDto);
    
    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(signupDto.email);
    expect(mockTeamRepository.getTeamById).not.toHaveBeenCalled();
    expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    expect(result).toEqual(ResponseMapper.validationError('Email is already registered'));
  });
  
  it('should return validation error when team does not exist', async () => {
    // Arrange
    const signupDto: SignupRequestDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: EUserRole.TEAM_MEMBER,
      teamId: 'nonexistent'
    };
    
    // Mock repository responses
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockTeamRepository.getTeamById.mockResolvedValue(null);
    
    // Act
    const result = await signup.execute(signupDto);
    
    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(signupDto.email);
    expect(mockTeamRepository.getTeamById).toHaveBeenCalledWith(signupDto.teamId);
    expect(mockUserRepository.createUser).not.toHaveBeenCalled();
    expect(result).toEqual(ResponseMapper.validationError('Selected team does not exist'));
  });
  
  it('should return server error when user creation fails', async () => {
    // Arrange
    const signupDto: SignupRequestDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: EUserRole.TEAM_MEMBER,
      teamId: '456'
    };
    
    // Mock repository responses
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockTeamRepository.getTeamById.mockResolvedValue(mockTeam);
    mockUserRepository.createUser.mockResolvedValue(null);
    
    // Act
    const result = await signup.execute(signupDto);
    
    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(signupDto.email);
    expect(mockTeamRepository.getTeamById).toHaveBeenCalledWith(signupDto.teamId);
    expect(mockUserRepository.createUser).toHaveBeenCalledWith(signupDto);
    expect(result).toEqual(ResponseMapper.serverError(new Error('Failed to create user')));
  });
  
  it('should handle exceptions and return server error', async () => {
    // Arrange
    const signupDto: SignupRequestDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      role: EUserRole.TEAM_MEMBER,
      teamId: '456'
    };
    
    const error = new Error('Database connection error');
    
    // Mock repository responses to throw error
    mockUserRepository.findByEmail.mockRejectedValue(error);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await signup.execute(signupDto);
    
    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(signupDto.email);
    expect(serverErrorSpy).toHaveBeenCalledWith(error);
  });
}); 
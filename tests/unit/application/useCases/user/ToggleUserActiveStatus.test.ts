import { ToggleUserActiveStatus, ToggleUserStatusRequestDto } from '../../../../../src/application/useCases/user/ToggleUserActiveStatus';
import { IUserRepository } from '../../../../../src/domain/interfaces/repositories/UserRepository';
import { User, VerificationStatus, EUserRole } from '../../../../../src/domain/entities/User';
import { ResponseMapper } from '../../../../../src/mappers/ResponseMapper';
import { UserMapper } from '../../../../../src/mappers/UserMapper';
import { UserDTO } from '../../../../../src/dtos/AuthDto';
import { TeamDTO } from '../../../../../src/dtos/TeamDto';

// Mock dependencies
const mockUserRepository: jest.Mocked<IUserRepository> = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  findByIdWithoutDeleteUser: jest.fn(),
  createUser: jest.fn(),
  verifyPassword: jest.fn(),
  generateToken: jest.fn(),
  verifyToken: jest.fn(),
  getAllUsers: jest.fn(),
  getTotalUsersCount: jest.fn(),
  updateVerificationStatus: jest.fn(),
  updateUser: jest.fn(),
  updatePassword: jest.fn(),
  toggleUserActiveStatus: jest.fn()
};

// Mock console.log to avoid cluttering test output
jest.spyOn(console, 'log').mockImplementation(() => {});

// Mock team data
const mockTeam: TeamDTO = {
  id: 'team-id-123',
  name: 'Test Team',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

// Mock active user
const mockActiveUser = {
  getId: jest.fn().mockReturnValue('user-id-123'),
  isActive: jest.fn().mockReturnValue(true)
} as unknown as User;

// Mock inactive user
const mockInactiveUser = {
  getId: jest.fn().mockReturnValue('user-id-123'),
  isActive: jest.fn().mockReturnValue(false)
} as unknown as User;

// Mock user DTOs
const mockActiveUserDTO: UserDTO = {
  id: 'user-id-123',
  name: 'Active User',
  email: 'active@example.com',
  role: EUserRole.TEAM_MEMBER,
  teamId: mockTeam.id,
  verificationStatus: VerificationStatus.VERIFIED,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const mockInactiveUserDTO: UserDTO = { ...mockActiveUserDTO };

// Test ToggleUserActiveStatus use case
describe('ToggleUserActiveStatus Use Case', () => {
  let toggleUserActiveStatus: ToggleUserActiveStatus;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked repository
    toggleUserActiveStatus = new ToggleUserActiveStatus(mockUserRepository);
    
    // Mock the UserMapper.toDTO method
    jest.spyOn(UserMapper, 'toDTO')
      .mockImplementation((user: User) => {
        if ((user as any).isActive()) {
          return mockActiveUserDTO;
        }
        return mockInactiveUserDTO;
      });
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  it('should successfully activate an inactive user', async () => {
    // Arrange
    const requestDto: ToggleUserStatusRequestDto = {
      userId: 'user-id-123',
      isActive: true
    };
    
    // Mock repository responses
    mockUserRepository.findById.mockResolvedValue(mockInactiveUser);
    mockUserRepository.toggleUserActiveStatus.mockResolvedValue(mockActiveUser);
    
    // Act
    const result = await toggleUserActiveStatus.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(requestDto.userId);
    expect(mockInactiveUser.isActive).toHaveBeenCalled();
    expect(mockUserRepository.toggleUserActiveStatus).toHaveBeenCalledWith(
      requestDto.userId,
      requestDto.isActive
    );
    expect(UserMapper.toDTO).toHaveBeenCalledWith(mockActiveUser);
    expect(result).toEqual(
      ResponseMapper.success(
        {
          success: true,
          user: mockActiveUserDTO,
          message: 'User activated successfully'
        },
        'User activated successfully'
      )
    );
  });
  
  it('should successfully deactivate an active user', async () => {
    // Arrange
    const requestDto: ToggleUserStatusRequestDto = {
      userId: 'user-id-123',
      isActive: false
    };
    
    // Mock repository responses
    mockUserRepository.findById.mockResolvedValue(mockActiveUser);
    mockUserRepository.toggleUserActiveStatus.mockResolvedValue(mockInactiveUser);
    
    // Act
    const result = await toggleUserActiveStatus.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(requestDto.userId);
    expect(mockActiveUser.isActive).toHaveBeenCalled();
    expect(mockUserRepository.toggleUserActiveStatus).toHaveBeenCalledWith(
      requestDto.userId,
      requestDto.isActive
    );
    expect(UserMapper.toDTO).toHaveBeenCalledWith(mockInactiveUser);
    expect(result).toEqual(
      ResponseMapper.success(
        {
          success: true,
          user: mockInactiveUserDTO,
          message: 'User deactivated successfully'
        },
        'User deactivated successfully'
      )
    );
  });
  
  it('should return early if user is already in desired state (active)', async () => {
    // Arrange
    const requestDto: ToggleUserStatusRequestDto = {
      userId: 'user-id-123',
      isActive: true // User is already active
    };
    
    // Mock repository responses
    mockUserRepository.findById.mockResolvedValue(mockActiveUser);
    
    // Act
    const result = await toggleUserActiveStatus.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(requestDto.userId);
    expect(mockActiveUser.isActive).toHaveBeenCalled();
    expect(mockUserRepository.toggleUserActiveStatus).not.toHaveBeenCalled();
    expect(UserMapper.toDTO).toHaveBeenCalledWith(mockActiveUser);
    expect(result).toEqual(
      ResponseMapper.success(
        {
          success: true,
          user: mockActiveUserDTO,
          message: 'User is already active'
        },
        'User is already active'
      )
    );
  });
  
  it('should return early if user is already in desired state (inactive)', async () => {
    // Arrange
    const requestDto: ToggleUserStatusRequestDto = {
      userId: 'user-id-123',
      isActive: false // User is already inactive
    };
    
    // Mock repository responses
    mockUserRepository.findById.mockResolvedValue(mockInactiveUser);
    
    // Act
    const result = await toggleUserActiveStatus.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(requestDto.userId);
    expect(mockInactiveUser.isActive).toHaveBeenCalled();
    expect(mockUserRepository.toggleUserActiveStatus).not.toHaveBeenCalled();
    expect(UserMapper.toDTO).toHaveBeenCalledWith(mockInactiveUser);
    expect(result).toEqual(
      ResponseMapper.success(
        {
          success: true,
          user: mockInactiveUserDTO,
          message: 'User is already inactive'
        },
        'User is already inactive'
      )
    );
  });
  
  it('should return not found when user does not exist', async () => {
    // Arrange
    const requestDto: ToggleUserStatusRequestDto = {
      userId: 'non-existent-id',
      isActive: true
    };
    
    // Mock repository responses
    mockUserRepository.findById.mockResolvedValue(null);
    
    // Act
    const result = await toggleUserActiveStatus.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(requestDto.userId);
    expect(mockUserRepository.toggleUserActiveStatus).not.toHaveBeenCalled();
    expect(result).toEqual(ResponseMapper.notFound('User not found'));
  });
  
  it('should return server error if update fails', async () => {
    // Arrange
    const requestDto: ToggleUserStatusRequestDto = {
      userId: 'user-id-123',
      isActive: true
    };
    
    // Mock repository responses
    mockUserRepository.findById.mockResolvedValue(mockInactiveUser);
    mockUserRepository.toggleUserActiveStatus.mockResolvedValue(null);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await toggleUserActiveStatus.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(requestDto.userId);
    expect(mockUserRepository.toggleUserActiveStatus).toHaveBeenCalledWith(
      requestDto.userId,
      requestDto.isActive
    );
    expect(serverErrorSpy).toHaveBeenCalledWith(
      new Error('Failed to activate user')
    );
  });
  
  it('should handle exceptions and return server error', async () => {
    // Arrange
    const requestDto: ToggleUserStatusRequestDto = {
      userId: 'user-id-123',
      isActive: true
    };
    
    const error = new Error('Database connection error');
    
    // Mock repository responses to throw error
    mockUserRepository.findById.mockRejectedValue(error);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await toggleUserActiveStatus.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(requestDto.userId);
    expect(serverErrorSpy).toHaveBeenCalledWith(error);
  });
}); 
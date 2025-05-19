import { ChangeUserRole, ChangeUserRoleRequestDto } from '../../../../../src/application/useCases/admin/ChangeUserRole';
import { IUserRepository } from '../../../../../src/domain/interfaces/repositories/UserRepository';
import { User, VerificationStatus, EUserRole } from '../../../../../src/domain/entities/User';
import { ResponseMapper } from '../../../../../src/mappers/ResponseMapper';
import { UserMapper } from '../../../../../src/mappers/UserMapper';
import { UserDTO } from '../../../../../src/dtos/AuthDto';
import { TeamDTO } from '../../../../../src/dtos/TeamDto';

// Mock team data
const mockTeam: TeamDTO & { toString: () => string } = {
  id: 'team-id-123',
  name: 'Test Team',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  toString: function() { return this.id; }
};

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

// Mock user properties for team member
const mockUserProps = {
  id: 'user-id-123',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  role: EUserRole.TEAM_MEMBER,
  teamId: mockTeam,
  verificationStatus: VerificationStatus.VERIFIED,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

// Create mock User instance
const mockUser = User.create(mockUserProps);

// Mock user DTO
const mockUserDTO: UserDTO = {
  id: 'user-id-123',
  name: 'Test User',
  email: 'test@example.com',
  role: EUserRole.TEAM_MEMBER,
  teamId: mockTeam.id,
  verificationStatus: VerificationStatus.VERIFIED,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

// Mock updated user with team lead role
const mockUpdatedUserProps = {
  ...mockUserProps,
  role: EUserRole.TEAM_LEAD
};

const mockUpdatedUser = User.create(mockUpdatedUserProps);

const mockUpdatedUserDTO: UserDTO = {
  ...mockUserDTO,
  role: EUserRole.TEAM_LEAD
};

// Test ChangeUserRole use case
describe('ChangeUserRole Use Case', () => {
  let changeUserRole: ChangeUserRole;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked repository
    changeUserRole = new ChangeUserRole(mockUserRepository);
    
    // Mock the UserMapper.toDTO method
    jest.spyOn(UserMapper, 'toDTO')
      .mockImplementation((user: User) => {
        if (user.getRole() === EUserRole.TEAM_LEAD) {
          return mockUpdatedUserDTO;
        }
        return mockUserDTO;
      });
  });
  
  it('should successfully change a user role', async () => {
    // Arrange
    const requestDto: ChangeUserRoleRequestDto = {
      userId: 'user-id-123',
      role: EUserRole.TEAM_LEAD
    };
    
    // Mock repository responses
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.updateUser.mockResolvedValue(mockUpdatedUser);
    
    // Act
    const result = await changeUserRole.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(requestDto.userId);
    expect(UserMapper.toDTO).toHaveBeenCalledWith(mockUser);
    expect(mockUserRepository.updateUser).toHaveBeenCalledWith(
      requestDto.userId,
      { ...mockUserDTO, role: EUserRole.TEAM_LEAD }
    );
    expect(UserMapper.toDTO).toHaveBeenCalledWith(mockUpdatedUser);
    expect(result).toEqual(
      ResponseMapper.success(
        {
          success: true,
          user: mockUpdatedUserDTO,
          message: `User role changed to ${EUserRole.TEAM_LEAD} successfully`
        },
        `User role changed to ${EUserRole.TEAM_LEAD} successfully`
      )
    );
  });
  
  it('should return error for invalid role', async () => {
    // Arrange
    const requestDto: ChangeUserRoleRequestDto = {
      userId: 'user-id-123',
      role: 'INVALID_ROLE'
    };
    
    // Act
    const result = await changeUserRole.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findById).not.toHaveBeenCalled();
    expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
    expect(result).toEqual(
      ResponseMapper.badRequest(`Invalid role: ${requestDto.role}. Valid roles are: ${Object.values(EUserRole).join(', ')}`)
    );
  });
  
  it('should return not found when user does not exist', async () => {
    // Arrange
    const requestDto: ChangeUserRoleRequestDto = {
      userId: 'non-existent-id',
      role: EUserRole.TEAM_LEAD
    };
    
    // Mock repository responses
    mockUserRepository.findById.mockResolvedValue(null);
    
    // Act
    const result = await changeUserRole.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(requestDto.userId);
    expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
    expect(result).toEqual(ResponseMapper.notFound('User not found'));
  });
  
  it('should return early if user already has the specified role', async () => {
    // Arrange
    const requestDto: ChangeUserRoleRequestDto = {
      userId: 'user-id-123',
      role: EUserRole.TEAM_MEMBER // User already has this role
    };
    
    // Mock repository responses
    mockUserRepository.findById.mockResolvedValue(mockUser);
    
    // Act
    const result = await changeUserRole.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(requestDto.userId);
    expect(UserMapper.toDTO).toHaveBeenCalledWith(mockUser);
    expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
    expect(result).toEqual(
      ResponseMapper.success(
        {
          success: true,
          user: mockUserDTO,
          message: `User already has the role ${EUserRole.TEAM_MEMBER}`
        },
        `User already has the role ${EUserRole.TEAM_MEMBER}`
      )
    );
  });
  
  it('should return server error if update fails', async () => {
    // Arrange
    const requestDto: ChangeUserRoleRequestDto = {
      userId: 'user-id-123',
      role: EUserRole.TEAM_LEAD
    };
    
    // Mock repository responses
    mockUserRepository.findById.mockResolvedValue(mockUser);
    mockUserRepository.updateUser.mockResolvedValue(null);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await changeUserRole.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(requestDto.userId);
    expect(mockUserRepository.updateUser).toHaveBeenCalledWith(
      requestDto.userId,
      { ...mockUserDTO, role: EUserRole.TEAM_LEAD }
    );
    expect(serverErrorSpy).toHaveBeenCalledWith(
      new Error(`Failed to update user role to ${EUserRole.TEAM_LEAD}`)
    );
  });
  
  it('should handle exceptions and return server error', async () => {
    // Arrange
    const requestDto: ChangeUserRoleRequestDto = {
      userId: 'user-id-123',
      role: EUserRole.TEAM_LEAD
    };
    
    const error = new Error('Database connection error');
    
    // Mock repository responses to throw error
    mockUserRepository.findById.mockRejectedValue(error);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await changeUserRole.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findById).toHaveBeenCalledWith(requestDto.userId);
    expect(serverErrorSpy).toHaveBeenCalledWith(error);
  });
}); 
import { ChangeUserTeam, ChangeUserTeamRequestDto } from '../../../../../src/application/useCases/admin/ChangeUserTeam';
import { IUserRepository } from '../../../../../src/domain/interfaces/repositories/UserRepository';
import { User, VerificationStatus, EUserRole } from '../../../../../src/domain/entities/User';
import { ResponseMapper } from '../../../../../src/mappers/ResponseMapper';
import { UserMapper } from '../../../../../src/mappers/UserMapper';
import { UserDTO } from '../../../../../src/dtos/AuthDto';
import { TeamDTO } from '../../../../../src/dtos/TeamDto';
import mongoose from 'mongoose';

// Mock mongoose.Types.ObjectId.isValid
jest.mock('mongoose', () => ({
  Types: {
    ObjectId: {
      isValid: jest.fn((id) => /^[0-9a-fA-F]{24}$/.test(id))
    }
  }
}));

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

// Mock team data
const mockTeam: TeamDTO & { toString: () => string } = {
  id: '60d21b4667d0d8992e610c85', // Valid ObjectId format
  name: 'Test Team',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  toString: function() { return this.id; }
};

const newTeam: TeamDTO & { toString: () => string } = {
  id: '60d21b4667d0d8992e610c86', // Different valid ObjectId
  name: 'New Team',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  toString: function() { return this.id; }
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

// Create mock User instance with methods to get team ID
const mockUser = {
  ...User.create(mockUserProps),
  getTeamId: jest.fn().mockReturnValue(mockTeam)
};

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

// Mock updated user with different team
const newTeamId = newTeam.id;

const mockUpdatedUserProps = {
  ...mockUserProps,
  teamId: newTeam
};

// Create mock Updated User instance with methods to get team ID
const mockUpdatedUser = {
  ...User.create(mockUpdatedUserProps),
  getTeamId: jest.fn().mockReturnValue(newTeam)
};

const mockUpdatedUserDTO: UserDTO = {
  ...mockUserDTO,
  teamId: newTeamId
};

// Test ChangeUserTeam use case
describe('ChangeUserTeam Use Case', () => {
  let changeUserTeam: ChangeUserTeam;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked repository
    changeUserTeam = new ChangeUserTeam(mockUserRepository);
    
    // Mock the UserMapper.toDTO method
    jest.spyOn(UserMapper, 'toDTO')
      .mockImplementation((user: User) => {
        if (user.getTeamId().toString() === newTeamId) {
          return mockUpdatedUserDTO;
        }
        return mockUserDTO;
      });
  });
  
  it('should successfully change a user team', async () => {
    // Arrange
    const requestDto: ChangeUserTeamRequestDto = {
      userId: 'user-id-123',
      teamId: newTeamId
    };
    
    // Mock repository responses
    mockUserRepository.findById.mockResolvedValue(mockUser as unknown as User);
    mockUserRepository.updateUser.mockResolvedValue(mockUpdatedUser as unknown as User);
    
    // Act
    const result = await changeUserTeam.execute(requestDto);
    
    // Assert
    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(requestDto.teamId);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(requestDto.userId);
    expect(mockUser.getTeamId).toHaveBeenCalled();
    expect(UserMapper.toDTO).toHaveBeenCalledWith(mockUser);
    expect(mockUserRepository.updateUser).toHaveBeenCalledWith(
      requestDto.userId,
      { ...mockUserDTO, teamId: newTeamId }
    );
    expect(UserMapper.toDTO).toHaveBeenCalledWith(mockUpdatedUser);
    expect(result).toEqual(
      ResponseMapper.success(
        {
          success: true,
          user: mockUpdatedUserDTO,
          message: 'User team updated successfully'
        },
        'User team updated successfully'
      )
    );
  });
  
  it('should return error for invalid team ID format', async () => {
    // Arrange
    const requestDto: ChangeUserTeamRequestDto = {
      userId: 'user-id-123',
      teamId: 'invalid-team-id'
    };
    
    // Mock mongoose.Types.ObjectId.isValid for this test
    (mongoose.Types.ObjectId.isValid as jest.Mock).mockReturnValueOnce(false);
    
    // Act
    const result = await changeUserTeam.execute(requestDto);
    
    // Assert
    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(requestDto.teamId);
    expect(mockUserRepository.findById).not.toHaveBeenCalled();
    expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
    expect(result).toEqual(
      ResponseMapper.badRequest(`Invalid teamId format: ${requestDto.teamId}`)
    );
  });
  
  it('should return not found when user does not exist', async () => {
    // Arrange
    const requestDto: ChangeUserTeamRequestDto = {
      userId: 'non-existent-id',
      teamId: newTeamId
    };
    
    // Mock repository responses
    mockUserRepository.findById.mockResolvedValue(null);
    
    // Act
    const result = await changeUserTeam.execute(requestDto);
    
    // Assert
    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(requestDto.teamId);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(requestDto.userId);
    expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
    expect(result).toEqual(ResponseMapper.notFound('User not found'));
  });
  
  it('should return early if user already belongs to the specified team', async () => {
    // Arrange
    const requestDto: ChangeUserTeamRequestDto = {
      userId: 'user-id-123',
      teamId: mockTeam.id // User already belongs to this team
    };
    
    // Mock repository responses
    mockUserRepository.findById.mockResolvedValue(mockUser as unknown as User);
    
    // Act
    const result = await changeUserTeam.execute(requestDto);
    
    // Assert
    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(requestDto.teamId);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(requestDto.userId);
    expect(mockUser.getTeamId).toHaveBeenCalled();
    expect(UserMapper.toDTO).toHaveBeenCalledWith(mockUser);
    expect(mockUserRepository.updateUser).not.toHaveBeenCalled();
    expect(result).toEqual(
      ResponseMapper.success(
        {
          success: true,
          user: mockUserDTO,
          message: 'User already belongs to this team'
        },
        'User already belongs to this team'
      )
    );
  });
  
  it('should return server error if update fails', async () => {
    // Arrange
    const requestDto: ChangeUserTeamRequestDto = {
      userId: 'user-id-123',
      teamId: newTeamId
    };
    
    // Mock repository responses
    mockUserRepository.findById.mockResolvedValue(mockUser as unknown as User);
    mockUserRepository.updateUser.mockResolvedValue(null);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await changeUserTeam.execute(requestDto);
    
    // Assert
    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(requestDto.teamId);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(requestDto.userId);
    expect(mockUserRepository.updateUser).toHaveBeenCalledWith(
      requestDto.userId,
      { ...mockUserDTO, teamId: newTeamId }
    );
    expect(serverErrorSpy).toHaveBeenCalledWith(
      new Error('Failed to update user team')
    );
  });
  
  it('should handle exceptions and return server error', async () => {
    // Arrange
    const requestDto: ChangeUserTeamRequestDto = {
      userId: 'user-id-123',
      teamId: newTeamId
    };
    
    const error = new Error('Database connection error');
    
    // Mock repository responses to throw error
    mockUserRepository.findById.mockRejectedValue(error);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await changeUserTeam.execute(requestDto);
    
    // Assert
    expect(mongoose.Types.ObjectId.isValid).toHaveBeenCalledWith(requestDto.teamId);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(requestDto.userId);
    expect(serverErrorSpy).toHaveBeenCalledWith(error);
  });
}); 
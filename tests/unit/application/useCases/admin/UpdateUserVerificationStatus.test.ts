import { UpdateUserVerificationStatus } from '../../../../../src/application/useCases/admin/UpdateUserVerificationStatus';
import { IUserRepository } from '../../../../../src/domain/interfaces/repositories/UserRepository';
import { User, VerificationStatus, EUserRole } from '../../../../../src/domain/entities/User';
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

// Mock team
const mockTeam: TeamDTO & { toString: () => string } = {
  id: 'team-id-123',
  name: 'Test Team',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  toString: function() { return this.id; }
};

// Mock user properties
const mockUserProps = {
  id: 'user-id-123',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  role: EUserRole.TEAM_MEMBER,
  teamId: mockTeam,
  verificationStatus: VerificationStatus.PENDING,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

// Create mock User instance
const mockUser = User.create(mockUserProps);

// Create mock verified user
const mockVerifiedUserProps = {
  ...mockUserProps,
  verificationStatus: VerificationStatus.VERIFIED
};

const mockVerifiedUser = User.create(mockVerifiedUserProps);

// Create mock rejected user
const mockRejectedUserProps = {
  ...mockUserProps,
  verificationStatus: VerificationStatus.REJECTED
};

const mockRejectedUser = User.create(mockRejectedUserProps);

describe('UpdateUserVerificationStatus Use Case', () => {
  let updateUserVerificationStatus: UpdateUserVerificationStatus;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked repository
    updateUserVerificationStatus = new UpdateUserVerificationStatus(mockUserRepository);
  });
  
  it('should successfully update user verification status to VERIFIED', async () => {
    // Arrange
    const userId = 'user-id-123';
    const newStatus = VerificationStatus.VERIFIED;
    
    // Mock repository responses
    mockUserRepository.updateVerificationStatus.mockResolvedValue(mockVerifiedUser);
    
    // Act
    const result = await updateUserVerificationStatus.execute(userId, newStatus);
    
    // Assert
    expect(mockUserRepository.updateVerificationStatus).toHaveBeenCalledWith(userId, newStatus);
    expect(result).toEqual(mockVerifiedUser);
  });
  
  it('should successfully update user verification status to REJECTED', async () => {
    // Arrange
    const userId = 'user-id-123';
    const newStatus = VerificationStatus.REJECTED;
    
    // Mock repository responses
    mockUserRepository.updateVerificationStatus.mockResolvedValue(mockRejectedUser);
    
    // Act
    const result = await updateUserVerificationStatus.execute(userId, newStatus);
    
    // Assert
    expect(mockUserRepository.updateVerificationStatus).toHaveBeenCalledWith(userId, newStatus);
    expect(result).toEqual(mockRejectedUser);
  });
  
  it('should return null for invalid verification status', async () => {
    // Arrange
    const userId = 'user-id-123';
    const invalidStatus = 'INVALID_STATUS';
    
    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Act
    const result = await updateUserVerificationStatus.execute(userId, invalidStatus);
    
    // Assert
    expect(mockUserRepository.updateVerificationStatus).not.toHaveBeenCalled();
    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error in UpdateUserVerificationStatus use case:',
      expect.any(Error)
    );
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
  
  it('should return null if repository update fails', async () => {
    // Arrange
    const userId = 'user-id-123';
    const newStatus = VerificationStatus.VERIFIED;
    
    // Mock repository responses
    mockUserRepository.updateVerificationStatus.mockResolvedValue(null);
    
    // Act
    const result = await updateUserVerificationStatus.execute(userId, newStatus);
    
    // Assert
    expect(mockUserRepository.updateVerificationStatus).toHaveBeenCalledWith(userId, newStatus);
    expect(result).toBeNull();
  });
  
  it('should handle exceptions and return null', async () => {
    // Arrange
    const userId = 'user-id-123';
    const newStatus = VerificationStatus.VERIFIED;
    const error = new Error('Database connection error');
    
    // Mock repository responses to throw error
    mockUserRepository.updateVerificationStatus.mockRejectedValue(error);
    
    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Act
    const result = await updateUserVerificationStatus.execute(userId, newStatus);
    
    // Assert
    expect(mockUserRepository.updateVerificationStatus).toHaveBeenCalledWith(userId, newStatus);
    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error in UpdateUserVerificationStatus use case:',
      error
    );
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
}); 
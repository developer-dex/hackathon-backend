import { GetAllUsers } from '../../../../../src/application/useCases/admin/GetAllUsers';
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
  id: 'team-id-1',
  name: 'Test Team',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  toString: function() { return this.id; }
};

// Mock user data
const mockUserProps1 = {
  id: 'user-id-1',
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'hashedPassword',
  role: EUserRole.ADMIN,
  teamId: mockTeam, // Admins can have teams too
  verificationStatus: VerificationStatus.VERIFIED,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const mockUserProps2 = {
  id: 'user-id-2',
  name: 'Team Member',
  email: 'member@example.com',
  password: 'hashedPassword',
  role: EUserRole.TEAM_MEMBER,
  teamId: mockTeam,
  verificationStatus: VerificationStatus.VERIFIED,
  createdAt: '2023-01-02T00:00:00.000Z',
  updatedAt: '2023-01-02T00:00:00.000Z'
};

const mockUserProps3 = {
  id: 'user-id-3',
  name: 'Team Lead',
  email: 'lead@example.com',
  password: 'hashedPassword',
  role: EUserRole.TEAM_LEAD,
  teamId: mockTeam,
  verificationStatus: VerificationStatus.VERIFIED,
  createdAt: '2023-01-03T00:00:00.000Z',
  updatedAt: '2023-01-03T00:00:00.000Z'
};

// Create mock user instances
const mockUser1 = User.create(mockUserProps1);
const mockUser2 = User.create(mockUserProps2);
const mockUser3 = User.create(mockUserProps3);

describe('GetAllUsers Use Case', () => {
  let getAllUsers: GetAllUsers;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked repository
    getAllUsers = new GetAllUsers(mockUserRepository);
  });
  
  it('should get all users without filtering or pagination', async () => {
    // Arrange
    const mockUsers = [mockUser1, mockUser2, mockUser3];
    const totalCount = mockUsers.length;
    
    // Mock repository responses
    mockUserRepository.getAllUsers.mockResolvedValue(mockUsers);
    mockUserRepository.getTotalUsersCount.mockResolvedValue(totalCount);
    
    // Act
    const result = await getAllUsers.execute();
    
    // Assert
    expect(mockUserRepository.getAllUsers).toHaveBeenCalledWith(undefined, undefined, 0);
    expect(mockUserRepository.getTotalUsersCount).toHaveBeenCalledWith(undefined);
    expect(result).toEqual({
      users: mockUsers,
      totalCount
    });
  });
  
  it('should filter users by role', async () => {
    // Arrange
    const role = EUserRole.TEAM_MEMBER;
    const mockUsers = [mockUser2];
    const totalCount = mockUsers.length;
    
    // Mock repository responses
    mockUserRepository.getAllUsers.mockResolvedValue(mockUsers);
    mockUserRepository.getTotalUsersCount.mockResolvedValue(totalCount);
    
    // Act
    const result = await getAllUsers.execute(role);
    
    // Assert
    expect(mockUserRepository.getAllUsers).toHaveBeenCalledWith(role, undefined, 0);
    expect(mockUserRepository.getTotalUsersCount).toHaveBeenCalledWith(role);
    expect(result).toEqual({
      users: mockUsers,
      totalCount
    });
  });
  
  it('should apply pagination correctly', async () => {
    // Arrange
    const limit = 2;
    const offset = 1;
    const expectedSkip = 0; // (offset - 1) * limit = (1 - 1) * 2 = 0
    const mockUsers = [mockUser1, mockUser2];
    const totalCount = 3; // Total of 3 users, but only returning 2
    
    // Mock repository responses
    mockUserRepository.getAllUsers.mockResolvedValue(mockUsers);
    mockUserRepository.getTotalUsersCount.mockResolvedValue(totalCount);
    
    // Act
    const result = await getAllUsers.execute(undefined, limit, offset);
    
    // Assert
    expect(mockUserRepository.getAllUsers).toHaveBeenCalledWith(undefined, limit, expectedSkip);
    expect(mockUserRepository.getTotalUsersCount).toHaveBeenCalledWith(undefined);
    expect(result).toEqual({
      users: mockUsers,
      totalCount
    });
  });
  
  it('should handle pagination with role filtering', async () => {
    // Arrange
    const role = EUserRole.TEAM_LEAD;
    const limit = 1;
    const offset = 2;
    const expectedSkip = 1; // (offset - 1) * limit = (2 - 1) * 1 = 1
    const mockUsers = [mockUser3];
    const totalCount = 1;
    
    // Mock repository responses
    mockUserRepository.getAllUsers.mockResolvedValue(mockUsers);
    mockUserRepository.getTotalUsersCount.mockResolvedValue(totalCount);
    
    // Act
    const result = await getAllUsers.execute(role, limit, offset);
    
    // Assert
    expect(mockUserRepository.getAllUsers).toHaveBeenCalledWith(role, limit, expectedSkip);
    expect(mockUserRepository.getTotalUsersCount).toHaveBeenCalledWith(role);
    expect(result).toEqual({
      users: mockUsers,
      totalCount
    });
  });
  
  it('should handle errors and return empty results', async () => {
    // Arrange
    const error = new Error('Database error');
    
    // Mock repository to throw an error
    mockUserRepository.getAllUsers.mockRejectedValue(error);
    
    // Spy on console.error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Act
    const result = await getAllUsers.execute();
    
    // Assert
    expect(mockUserRepository.getAllUsers).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error in GetAllUsers use case:', error);
    expect(result).toEqual({
      users: [],
      totalCount: 0
    });
    
    // Restore console.error
    consoleErrorSpy.mockRestore();
  });
}); 
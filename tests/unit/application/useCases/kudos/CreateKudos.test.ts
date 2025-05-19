import { CreateKudos } from '../../../../../src/application/useCases/kudos/CreateKudos';
import { IKudosRepository } from '../../../../../src/domain/interfaces/repositories/KudosRepository';
import { IKudosCategoryRepository } from '../../../../../src/domain/interfaces/repositories/KudosCategoryRepository';
import { IUserRepository } from '../../../../../src/domain/interfaces/repositories/UserRepository';
import { User, EUserRole, VerificationStatus } from '../../../../../src/domain/entities/User';
import { Kudos } from '../../../../../src/domain/entities/Kudos';
import { KudosCategory } from '../../../../../src/domain/entities/KudosCategory';
import { CreateKudosDTO } from '../../../../../src/dtos/KudosDto';
import { UserDTO } from '../../../../../src/dtos/AuthDto';
import { ResponseMapper } from '../../../../../src/mappers/ResponseMapper';
import { TeamDTO } from '../../../../../src/dtos/TeamDto';

// Mock team data
const mockTeam: TeamDTO & { toString: () => string } = {
  id: 'team-123',
  name: 'Test Team',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  toString: function() { return this.id; }
};

// Mock dependencies
const mockKudosRepository: jest.Mocked<IKudosRepository> = {
  createKudos: jest.fn(),
  getKudosById: jest.fn(),
  getPopulatedKudos: jest.fn(),
  getKudosBySender: jest.fn(),
  getKudosByReceiver: jest.fn(),
  getAllKudos: jest.fn(),
  getAllKudosPopulated: jest.fn(),
  getTotalCount: jest.fn()
};

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

const mockCategoryRepository: jest.Mocked<IKudosCategoryRepository> = {
  createCategory: jest.fn(),
  getCategoryById: jest.fn(),
  getCategoryByName: jest.fn(),
  getAllCategories: jest.fn(),
  updateCategory: jest.fn(),
  deleteCategory: jest.fn(),
};

// Mock team lead user
const mockTeamLead = {
  getId: jest.fn().mockReturnValue('team-lead-123'),
  getRole: jest.fn().mockReturnValue(EUserRole.TEAM_LEAD),
  getTeamId: jest.fn().mockReturnValue(mockTeam)
} as unknown as User;

// Mock team member user
const mockTeamMember = {
  getId: jest.fn().mockReturnValue('team-member-456'),
  getRole: jest.fn().mockReturnValue(EUserRole.TEAM_MEMBER),
  getTeamId: jest.fn().mockReturnValue(mockTeam),
  teamId: mockTeam // Add this for the test to work with the actual implementation
} as unknown as User;

const mockTeamLeadDTO: UserDTO = {
  id: 'team-lead-123',
  name: 'Team Lead',
  email: 'teamlead@example.com',
  role: EUserRole.TEAM_LEAD,
  teamId: mockTeam.id,
  verificationStatus: VerificationStatus.VERIFIED,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

// Mock category data
const mockCategoryProps = {
  id: 'category-123',
  name: 'Leadership',
  description: 'For demonstrating leadership skills',
  icon: 'trophy',
  color: '#FFC107',
  isActive: true,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const mockCategory = KudosCategory.create(mockCategoryProps);

// Mock kudos data
const mockKudosProps = {
  id: 'kudos-123',
  senderId: 'team-lead-123',
  receiverId: 'team-member-456',
  categoryId: 'category-123',
  teamId: 'team-123',
  message: 'Great job leading the project!',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

const mockKudos = Kudos.create(mockKudosProps);

// Test CreateKudos use case
describe('CreateKudos Use Case', () => {
  let createKudos: CreateKudos;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked repositories
    createKudos = new CreateKudos(
      mockKudosRepository,
      mockUserRepository,
      mockCategoryRepository
    );
  });
  
  it('should successfully create kudos when all validations pass', async () => {
    // Arrange
    const createKudosDto: CreateKudosDTO = {
      senderId: 'team-lead-123',
      receiverId: 'team-member-456',
      categoryId: 'category-123',
      teamId: 'team-123',
      message: 'Great job leading the project!'
    };
    
    // Mock repository responses
    mockUserRepository.findByIdWithoutDeleteUser.mockResolvedValue(mockTeamMember);
    mockCategoryRepository.getCategoryById.mockResolvedValue(mockCategory);
    mockKudosRepository.createKudos.mockResolvedValue(mockKudos);
    
    // Act
    const result = await createKudos.execute(createKudosDto, mockTeamLeadDTO);
    
    // Assert
    expect(mockUserRepository.findByIdWithoutDeleteUser).toHaveBeenCalledWith(createKudosDto.receiverId);
    expect(mockCategoryRepository.getCategoryById).toHaveBeenCalledWith(createKudosDto.categoryId);
    expect(mockKudosRepository.createKudos).toHaveBeenCalled();
    // We can't check the exact parameters because teamId gets converted
    expect(result).toEqual(
      ResponseMapper.success(mockKudos, 'Kudos created successfully')
    );
  });
  
  it('should return unauthorized when user is not a team lead', async () => {
    // Arrange
    const createKudosDto: CreateKudosDTO = {
      senderId: 'team-member-789',
      receiverId: 'team-member-456',
      categoryId: 'category-123',
      teamId: 'team-123',
      message: 'Great job leading the project!'
    };
    
    const teamMemberSenderDTO: UserDTO = {
      id: 'team-member-789',
      name: 'Another Team Member',
      email: 'anothermember@example.com',
      role: EUserRole.TEAM_MEMBER,
      teamId: mockTeam.id,
      verificationStatus: VerificationStatus.VERIFIED,
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z'
    };
    
    // Act
    const result = await createKudos.execute(createKudosDto, teamMemberSenderDTO);
    
    // Assert
    expect(mockUserRepository.findByIdWithoutDeleteUser).not.toHaveBeenCalled();
    expect(mockCategoryRepository.getCategoryById).not.toHaveBeenCalled();
    expect(mockKudosRepository.createKudos).not.toHaveBeenCalled();
    expect(result).toEqual(
      ResponseMapper.unauthorized('Only team leads can give kudos')
    );
  });
  
  it('should return validation error when sender ID does not match authenticated user', async () => {
    // Arrange
    const createKudosDto: CreateKudosDTO = {
      senderId: 'different-team-lead-999',
      receiverId: 'team-member-456',
      categoryId: 'category-123',
      teamId: 'team-123',
      message: 'Great job leading the project!'
    };
    
    // Act
    const result = await createKudos.execute(createKudosDto, mockTeamLeadDTO);
    
    // Assert
    expect(mockUserRepository.findByIdWithoutDeleteUser).not.toHaveBeenCalled();
    expect(mockCategoryRepository.getCategoryById).not.toHaveBeenCalled();
    expect(mockKudosRepository.createKudos).not.toHaveBeenCalled();
    expect(result).toEqual(
      ResponseMapper.validationError('Sender ID must match the authenticated user')
    );
  });
  
  it('should return validation error when receiver is not found', async () => {
    // Arrange
    const createKudosDto: CreateKudosDTO = {
      senderId: 'team-lead-123',
      receiverId: 'nonexistent-user',
      categoryId: 'category-123',
      teamId: 'team-123',
      message: 'Great job leading the project!'
    };
    
    // Mock repository responses
    mockUserRepository.findByIdWithoutDeleteUser.mockResolvedValue(null);
    
    // Act
    const result = await createKudos.execute(createKudosDto, mockTeamLeadDTO);
    
    // Assert
    expect(mockUserRepository.findByIdWithoutDeleteUser).toHaveBeenCalledWith(createKudosDto.receiverId);
    expect(mockCategoryRepository.getCategoryById).not.toHaveBeenCalled();
    expect(mockKudosRepository.createKudos).not.toHaveBeenCalled();
    expect(result).toEqual(
      ResponseMapper.validationError('Receiver not found')
    );
  });
  
  it('should return validation error when category is not found', async () => {
    // Arrange
    const createKudosDto: CreateKudosDTO = {
      senderId: 'team-lead-123',
      receiverId: 'team-member-456',
      categoryId: 'nonexistent-category',
      teamId: 'team-123',
      message: 'Great job leading the project!'
    };
    
    // Mock repository responses
    mockUserRepository.findByIdWithoutDeleteUser.mockResolvedValue(mockTeamMember);
    mockCategoryRepository.getCategoryById.mockResolvedValue(null);
    
    // Act
    const result = await createKudos.execute(createKudosDto, mockTeamLeadDTO);
    
    // Assert
    expect(mockUserRepository.findByIdWithoutDeleteUser).toHaveBeenCalledWith(createKudosDto.receiverId);
    expect(mockCategoryRepository.getCategoryById).toHaveBeenCalledWith(createKudosDto.categoryId);
    expect(mockKudosRepository.createKudos).not.toHaveBeenCalled();
    expect(result).toEqual(
      ResponseMapper.validationError('Category not found')
    );
  });
  
  it('should return server error when kudos creation fails', async () => {
    // Arrange
    const createKudosDto: CreateKudosDTO = {
      senderId: 'team-lead-123',
      receiverId: 'team-member-456',
      categoryId: 'category-123',
      teamId: 'team-123',
      message: 'Great job leading the project!'
    };
    
    // Mock repository responses
    mockUserRepository.findByIdWithoutDeleteUser.mockResolvedValue(mockTeamMember);
    mockCategoryRepository.getCategoryById.mockResolvedValue(mockCategory);
    mockKudosRepository.createKudos.mockResolvedValue(null);
    
    // Act
    const result = await createKudos.execute(createKudosDto, mockTeamLeadDTO);
    
    // Assert
    expect(mockUserRepository.findByIdWithoutDeleteUser).toHaveBeenCalledWith(createKudosDto.receiverId);
    expect(mockCategoryRepository.getCategoryById).toHaveBeenCalledWith(createKudosDto.categoryId);
    expect(mockKudosRepository.createKudos).toHaveBeenCalled();
    expect(result).toEqual(
      ResponseMapper.serverError(new Error('Failed to create kudos'))
    );
  });
  
  it('should handle exceptions and return server error', async () => {
    // Arrange
    const createKudosDto: CreateKudosDTO = {
      senderId: 'team-lead-123',
      receiverId: 'team-member-456',
      categoryId: 'category-123',
      teamId: 'team-123',
      message: 'Great job leading the project!'
    };
    
    const error = new Error('Database connection error');
    
    // Mock repository responses to throw error
    mockUserRepository.findByIdWithoutDeleteUser.mockRejectedValue(error);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await createKudos.execute(createKudosDto, mockTeamLeadDTO);
    
    // Assert
    expect(mockUserRepository.findByIdWithoutDeleteUser).toHaveBeenCalledWith(createKudosDto.receiverId);
    expect(serverErrorSpy).toHaveBeenCalledWith(error);
  });
}); 
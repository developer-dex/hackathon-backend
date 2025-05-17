import { Login } from '../../../../../src/application/useCases/auth/Login';
import { IUserRepository } from '../../../../../src/domain/interfaces/repositories/IUserRepository';
import { User, VerificationStatus, EUserRole } from '../../../../../src/domain/entities/User';
import { LoginRequestDto, UserDTO } from '../../../../../src/dtos/AuthDto';
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

// Mock user properties for User.create
const mockUserProps = {
  id: '123',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  role: EUserRole.TEAM_MEMBER,
  teamId: '456',
  verificationStatus: VerificationStatus.VERIFIED,
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
  verificationStatus: VerificationStatus.VERIFIED,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

// Test Login use case
describe('Login Use Case', () => {
  let login: Login;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked repository
    login = new Login(mockUserRepository);
    
    // Mock the UserMapper.toDTO method
    jest.spyOn(UserMapper, 'toDTO').mockReturnValue(mockUserDTO);
  });
  
  it('should successfully login a user with valid credentials', async () => {
    // Arrange
    const loginDto: LoginRequestDto = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    // Mock repository responses
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockUserRepository.verifyPassword.mockResolvedValue(true);
    mockUserRepository.generateToken.mockReturnValue('mocked-jwt-token');
    
    // Act
    const result = await login.execute(loginDto);
    
    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
    expect(mockUserRepository.verifyPassword).toHaveBeenCalledWith(loginDto.password, mockUser.password);
    expect(UserMapper.toDTO).toHaveBeenCalledWith(mockUser);
    expect(mockUserRepository.generateToken).toHaveBeenCalledWith(mockUserDTO);
    expect(result).toEqual(
      ResponseMapper.success(
        { user: mockUserDTO, token: 'mocked-jwt-token' },
        'Login successful'
      )
    );
  });
  
  it('should return unauthorized when user is not found', async () => {
    // Arrange
    const loginDto: LoginRequestDto = {
      email: 'nonexistent@example.com',
      password: 'password123'
    };
    
    // Mock repository responses
    mockUserRepository.findByEmail.mockResolvedValue(null);
    
    // Act
    const result = await login.execute(loginDto);
    
    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
    expect(mockUserRepository.verifyPassword).not.toHaveBeenCalled();
    expect(result).toEqual(ResponseMapper.notFound('User not found'));
  });
  
  it('should return unauthorized when user is not verified', async () => {
    // Arrange
    const loginDto: LoginRequestDto = {
      email: 'unverified@example.com',
      password: 'password123'
    };
    
    const unverifiedUserProps = {
      ...mockUserProps,
      verificationStatus: VerificationStatus.PENDING
    };
    
    const unverifiedUser = User.create(unverifiedUserProps);
    
    // Mock repository responses
    mockUserRepository.findByEmail.mockResolvedValue(unverifiedUser);
    
    // Act
    const result = await login.execute(loginDto);
    
    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
    expect(mockUserRepository.verifyPassword).not.toHaveBeenCalled();
    expect(result).toEqual(ResponseMapper.unauthorized('Your account is not verified. Please contact team lead.'));
  });
  
  it('should return unauthorized when password is invalid', async () => {
    // Arrange
    const loginDto: LoginRequestDto = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };
    
    // Mock repository responses
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockUserRepository.verifyPassword.mockResolvedValue(false);
    
    // Act
    const result = await login.execute(loginDto);
    
    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
    expect(mockUserRepository.verifyPassword).toHaveBeenCalledWith(loginDto.password, mockUser.password);
    expect(result).toEqual(ResponseMapper.unauthorized('Invalid email or password'));
  });
  
  it('should handle exceptions and return server error', async () => {
    // Arrange
    const loginDto: LoginRequestDto = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const error = new Error('Database connection error');
    
    // Mock repository responses to throw error
    mockUserRepository.findByEmail.mockRejectedValue(error);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await login.execute(loginDto);
    
    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
    expect(serverErrorSpy).toHaveBeenCalledWith(error);
  });
}); 
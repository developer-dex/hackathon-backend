import { LoginUseCase } from '../../../src/usecases/auth/LoginUseCase';
import { AuthRepository } from '../../../src/usecases/auth/AuthRepository';
import { LoginRequest, User, UserDTO, UserRole } from '../../../src/entities/User';

describe('LoginUseCase', () => {
  // Mock AuthRepository
  const mockAuthRepository: jest.Mocked<AuthRepository> = {
    getUserByEmail: jest.fn(),
    verifyPassword: jest.fn(),
    generateToken: jest.fn(),
    verifyToken: jest.fn()
  };

  const loginUseCase = new LoginUseCase(mockAuthRepository);

  // Sample user data
  const mockUser: User = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword123',
    role: UserRole.TEAM_MEMBER,
    department: 'Engineering',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const mockUserDTO: UserDTO = {
    id: mockUser.id,
    name: mockUser.name,
    email: mockUser.email,
    role: mockUser.role,
    department: mockUser.department,
    createdAt: mockUser.createdAt,
    updatedAt: mockUser.updatedAt
  };

  const loginRequest: LoginRequest = {
    email: 'john@example.com',
    password: 'password123'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return success with user and token on successful login', async () => {
    // Mock implementations
    mockAuthRepository.getUserByEmail.mockResolvedValue(mockUser);
    mockAuthRepository.verifyPassword.mockResolvedValue(true);
    mockAuthRepository.generateToken.mockReturnValue('jwt-token-123');

    // Execute
    const result = await loginUseCase.execute(loginRequest);

    // Verify
    expect(mockAuthRepository.getUserByEmail).toHaveBeenCalledWith(loginRequest.email);
    expect(mockAuthRepository.verifyPassword).toHaveBeenCalledWith(
      loginRequest.password,
      mockUser.password
    );
    expect(mockAuthRepository.generateToken).toHaveBeenCalledWith(expect.objectContaining({
      id: mockUser.id,
      email: mockUser.email,
      role: mockUser.role
    }));

    expect(result).toEqual({
      success: true,
      data: {
        user: mockUserDTO,
        token: 'jwt-token-123'
      },
      message: 'Login successful'
    });
  });

  test('should return failure when user is not found', async () => {
    // Mock implementations
    mockAuthRepository.getUserByEmail.mockResolvedValue(null);

    // Execute
    const result = await loginUseCase.execute(loginRequest);

    // Verify
    expect(mockAuthRepository.getUserByEmail).toHaveBeenCalledWith(loginRequest.email);
    expect(mockAuthRepository.verifyPassword).not.toHaveBeenCalled();
    expect(mockAuthRepository.generateToken).not.toHaveBeenCalled();

    expect(result).toEqual({
      success: false,
      message: 'Authentication failed',
      error: 'Invalid email or password'
    });
  });

  test('should return failure when password is incorrect', async () => {
    // Mock implementations
    mockAuthRepository.getUserByEmail.mockResolvedValue(mockUser);
    mockAuthRepository.verifyPassword.mockResolvedValue(false);

    // Execute
    const result = await loginUseCase.execute(loginRequest);

    // Verify
    expect(mockAuthRepository.getUserByEmail).toHaveBeenCalledWith(loginRequest.email);
    expect(mockAuthRepository.verifyPassword).toHaveBeenCalledWith(
      loginRequest.password,
      mockUser.password
    );
    expect(mockAuthRepository.generateToken).not.toHaveBeenCalled();

    expect(result).toEqual({
      success: false,
      message: 'Authentication failed',
      error: 'Invalid email or password'
    });
  });

  test('should handle exceptions gracefully', async () => {
    // Mock implementations to throw error
    mockAuthRepository.getUserByEmail.mockRejectedValue(new Error('Database error'));

    // Execute
    const result = await loginUseCase.execute(loginRequest);

    // Verify
    expect(result).toEqual({
      success: false,
      message: 'Authentication failed',
      error: 'Database error'
    });
  });
}); 
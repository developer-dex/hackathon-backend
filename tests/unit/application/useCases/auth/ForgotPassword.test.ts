import { ForgotPassword } from '../../../../../src/application/useCases/auth/ForgotPassword';
import { IForgotPasswordRepository } from '../../../../../src/domain/interfaces/repositories/ForgotPasswordRepository';
import { IUserRepository } from '../../../../../src/domain/interfaces/repositories/UserRepository';
import { User, VerificationStatus, EUserRole } from '../../../../../src/domain/entities/User';
import { ForgotPassword as ForgotPasswordEntity } from '../../../../../src/domain/entities/ForgotPassword';
import { EmailService } from '../../../../../src/services/email/EmailService';
import { ForgotPasswordRequestDto } from '../../../../../src/dtos/AuthDto';
import { ResponseMapper } from '../../../../../src/mappers/ResponseMapper';
import { config } from '../../../../../src/config/config';
import { TeamDTO } from '../../../../../src/dtos/TeamDto';

// Mock dependencies
const mockForgotPasswordRepository: jest.Mocked<IForgotPasswordRepository> = {
  createPasswordResetToken: jest.fn(),
  findByToken: jest.fn(),
  markAsUsed: jest.fn(),
  deleteExpiredTokens: jest.fn()
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

const mockEmailService: jest.Mocked<EmailService> = {
  sendMail: jest.fn(),
  sendResetPasswordEmail: jest.fn()
} as unknown as jest.Mocked<EmailService>;

// Create mock dates
const now = new Date();
const futureDate = new Date(now.getTime() + 1200000); // 20 minutes in the future

// Mock team data
const mockTeam: TeamDTO & { toString: () => string } = {
  id: 'team-id-123',
  name: 'Test Team',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  toString: function() { return this.id; }
};

// Mock user properties for User.create
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

// Mock ForgotPassword entity
const mockResetToken = new ForgotPasswordEntity(
  'token-id-123',
  'user-id-123',
  'test@example.com',
  'reset-token-123',
  futureDate,
  false,
  new Date(now),
  new Date(now)
);

// Mock process.env.NODE_ENV
const originalNodeEnv = process.env.NODE_ENV;
jest.mock('../../../../../src/config/config', () => ({
  config: {
    frontendBaseUrl: 'http://localhost:3000',
    resetPasswordPath: '/reset-password',
    email: 'test@example.com',
    password: 'password123'
  }
}));

// Test ForgotPassword use case
describe('ForgotPassword Use Case', () => {
  let forgotPassword: ForgotPassword;
  
  beforeEach(() => {
    jest.clearAllMocks();
    // Create instance of use case with mocked dependencies
    forgotPassword = new ForgotPassword(
      mockForgotPasswordRepository,
      mockUserRepository,
      mockEmailService
    );
    
    // Reset process.env.NODE_ENV for development test
    process.env.NODE_ENV = 'development';
  });
  
  afterEach(() => {
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalNodeEnv;
  });
  
  it('should successfully create a reset token for an existing user', async () => {
    // Arrange
    const requestDto: ForgotPasswordRequestDto = {
      email: 'test@example.com'
    };
    
    const resetLink = `${config.frontendBaseUrl}${config.resetPasswordPath}?token=${mockResetToken.getToken()}`;
    
    // Mock repository and service responses
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockForgotPasswordRepository.deleteExpiredTokens.mockResolvedValue(3); // 3 tokens deleted
    mockForgotPasswordRepository.createPasswordResetToken.mockResolvedValue(mockResetToken);
    mockEmailService.sendResetPasswordEmail.mockResolvedValue(true);
    
    // Act
    const result = await forgotPassword.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(requestDto.email);
    expect(mockForgotPasswordRepository.deleteExpiredTokens).toHaveBeenCalled();
    expect(mockForgotPasswordRepository.createPasswordResetToken).toHaveBeenCalledWith(
      requestDto.email,
      mockUser.getId()
    );
    expect(mockEmailService.sendResetPasswordEmail).toHaveBeenCalledWith(
      requestDto.email,
      resetLink
    );
    expect(result).toEqual(
      ResponseMapper.success(
        {
          success: true,
          message: 'Password reset instructions sent to your email',
          resetLink
        },
        'Password reset instructions sent'
      )
    );
  });
  
  it('should not expose user existence for non-existent email', async () => {
    // Arrange
    const requestDto: ForgotPasswordRequestDto = {
      email: 'nonexistent@example.com'
    };
    
    // Mock repository responses
    mockUserRepository.findByEmail.mockResolvedValue(null);
    
    // Act
    const result = await forgotPassword.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(requestDto.email);
    expect(mockForgotPasswordRepository.deleteExpiredTokens).not.toHaveBeenCalled();
    expect(mockForgotPasswordRepository.createPasswordResetToken).not.toHaveBeenCalled();
    expect(mockEmailService.sendResetPasswordEmail).not.toHaveBeenCalled();
    expect(result).toEqual(
      ResponseMapper.success(
        {
          success: true,
          message: 'If your email is registered, you will receive a password reset link.'
        },
        'Password reset instructions sent'
      )
    );
  });
  
  it('should return server error if token creation fails', async () => {
    // Arrange
    const requestDto: ForgotPasswordRequestDto = {
      email: 'test@example.com'
    };
    
    // Mock repository responses
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockForgotPasswordRepository.deleteExpiredTokens.mockResolvedValue(0);
    mockForgotPasswordRepository.createPasswordResetToken.mockResolvedValue(null);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await forgotPassword.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(requestDto.email);
    expect(mockForgotPasswordRepository.deleteExpiredTokens).toHaveBeenCalled();
    expect(mockForgotPasswordRepository.createPasswordResetToken).toHaveBeenCalledWith(
      requestDto.email,
      mockUser.getId()
    );
    expect(mockEmailService.sendResetPasswordEmail).not.toHaveBeenCalled();
    expect(serverErrorSpy).toHaveBeenCalledWith(
      new Error('Failed to create password reset token')
    );
  });
  
  it('should not include reset link in production environment', async () => {
    // Arrange
    process.env.NODE_ENV = 'production';
    
    const requestDto: ForgotPasswordRequestDto = {
      email: 'test@example.com'
    };
    
    const resetLink = `${config.frontendBaseUrl}${config.resetPasswordPath}?token=${mockResetToken.getToken()}`;
    
    // Mock repository and service responses
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockForgotPasswordRepository.deleteExpiredTokens.mockResolvedValue(3);
    mockForgotPasswordRepository.createPasswordResetToken.mockResolvedValue(mockResetToken);
    mockEmailService.sendResetPasswordEmail.mockResolvedValue(true);
    
    // Act
    const result = await forgotPassword.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(requestDto.email);
    expect(mockEmailService.sendResetPasswordEmail).toHaveBeenCalledWith(
      requestDto.email,
      resetLink
    );
    expect(result).toEqual(
      ResponseMapper.success(
        {
          success: true,
          message: 'Password reset instructions sent to your email'
          // resetLink should not be included in production
        },
        'Password reset instructions sent'
      )
    );
    expect(result.data).not.toHaveProperty('resetLink');
  });
  
  it('should handle exceptions and return server error', async () => {
    // Arrange
    const requestDto: ForgotPasswordRequestDto = {
      email: 'test@example.com'
    };
    
    const error = new Error('Database connection error');
    
    // Mock repository responses to throw error
    mockUserRepository.findByEmail.mockRejectedValue(error);
    
    // Mock ResponseMapper.serverError
    const serverErrorSpy = jest.spyOn(ResponseMapper, 'serverError');
    
    // Act
    const result = await forgotPassword.execute(requestDto);
    
    // Assert
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(requestDto.email);
    expect(serverErrorSpy).toHaveBeenCalledWith(error);
  });
}); 
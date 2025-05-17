import { ApiResponseDto } from '../../../dtos/ApiResponseDto';
import { LoginRequestDto, LoginResponseDto } from '../../../dtos/AuthDto';
import { IUserRepository } from '../../../domain/interfaces/repositories/IUserRepository';
import { UserMapper } from '../../../mappers/UserMapper';
import { ResponseMapper } from '../../../mappers/ResponseMapper';
import { VerificationStatus } from '../../../domain/entities/User';

export class Login {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: LoginRequestDto): Promise<ApiResponseDto<LoginResponseDto>> {
    try {
      const { email, password } = dto;
      
      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      
      // If user not found
      if (!user) {
        return ResponseMapper.unauthorized('Invalid email or password');
      }
      
      // Check if user is verified
      if (user.verificationStatus !== VerificationStatus.VERIFIED) {
        return ResponseMapper.unauthorized('Your account is not verified. Please contact team lead.');
      }
      
      // Verify password
      const isPasswordValid = await this.userRepository.verifyPassword(password, user.password);
      
      if (!isPasswordValid) {
        return ResponseMapper.unauthorized('Invalid email or password');
      }
      
      // Create DTO without sensitive data
      const userDTO = UserMapper.toDTO(user);
      
      // Generate JWT token
      const token = this.userRepository.generateToken(userDTO);
      
      return ResponseMapper.success(
        { user: userDTO, token },
        'Login successful'
      );
    } catch (error) {
      return ResponseMapper.serverError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
} 
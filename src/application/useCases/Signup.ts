import { ApiResponseDto } from '../../dtos/ApiResponseDto';
import { SignupRequestDto, SignupResponseDto } from '../../dtos/SignupDto';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { UserMapper } from '../../mappers/UserMapper';
import { ResponseMapper } from '../../mappers/ResponseMapper';

export class Signup {
  constructor(private userRepository: UserRepository) {}

  async execute(dto: SignupRequestDto): Promise<ApiResponseDto<SignupResponseDto>> {
    try {
      // Check if passwords match
      if (dto.password !== dto.confirmPassword) {
        return ResponseMapper.validationError('Passwords do not match');
      }

      // Check if email already exists
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        return ResponseMapper.validationError('Email is already registered');
      }

      // Create user
      const newUser = await this.userRepository.createUser(dto);
      
      if (!newUser) {
        return ResponseMapper.serverError(new Error('Failed to create user'));
      }

      // Map to DTO without sensitive data
      const userDTO = UserMapper.toDTO(newUser);
      
      return ResponseMapper.success(
        userDTO,
        'User registered successfully. Verification status is pending.'
      );
    } catch (error) {
      return ResponseMapper.serverError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
} 
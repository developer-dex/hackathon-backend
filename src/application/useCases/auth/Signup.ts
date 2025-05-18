import { SignupRequestDto, SignupResponseDto } from '../../../dtos/AuthDto';
import { IUserRepository } from '../../../domain/interfaces/repositories/UserRepository';
import { ITeamRepository } from '../../../domain/interfaces/repositories/TeamRepository';
import { UserMapper } from '../../../mappers/UserMapper';
import { ResponseMapper } from '../../../mappers/ResponseMapper';
import { ApiResponseDto } from '../../../dtos/ApiResponseDto';

export class Signup {
  constructor(
    private userRepository: IUserRepository,
    private teamRepository: ITeamRepository
  ) {}

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

      // Check if team exists
      const team = await this.teamRepository.getTeamById(dto.teamId);
      if (!team) {
        return ResponseMapper.validationError('Selected team does not exist');
      }

      // Create user
      const newUser = await this.userRepository.createUser(dto);
      
      if (!newUser) {
        return ResponseMapper.serverError(new Error('Failed to create user'));
      }

      // Map to DTO without sensitive data
      const userDTO = UserMapper.toDTO(newUser);
      
      // Create response with team info
      const signupResponse: SignupResponseDto = {
        ...userDTO,
        team: {
          id: team.id,
          name: team.name
        }
      };
      
      return ResponseMapper.success(
        signupResponse,
        'User registered successfully. Verification status is pending.'
      );
    } catch (error) {
      return ResponseMapper.serverError(error instanceof Error ? error : new Error('Unknown error'));
    }
  }
} 
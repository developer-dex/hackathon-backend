import { ApiResponseDto } from '../../../dtos/ApiResponseDto';
import { LoginRequestDto, LoginResponseDto } from '../../../dtos/AuthDto';
import { IUserRepository } from '../../../domain/interfaces/repositories/UserRepository';
import { UserMapper } from '../../../mappers/UserMapper';
import { ResponseMapper } from '../../../mappers/ResponseMapper';
import { VerificationStatus } from '../../../domain/entities/User';

export class Login {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: LoginRequestDto): Promise<ApiResponseDto<LoginResponseDto>> {
    try {
      const { email, password } = dto;
      
      const userExist = await this.userRepository.findByEmail(email);
      
      if (!userExist) {
        return ResponseMapper.notFound('User not found');
      }
      
      if (userExist.verificationStatus !== VerificationStatus.VERIFIED) {
        return ResponseMapper.unauthorized('Your account is not verified. Please contact team lead.');
      }
      
      const isPasswordValid = await this.userRepository.verifyPassword(password, userExist.password);
      
      if (!isPasswordValid) {
        return ResponseMapper.unauthorized('Invalid email or password');
      }
      
      const userDTO = UserMapper.toDTO(userExist);
      
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
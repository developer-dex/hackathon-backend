import { ApiResponseDto } from "../../../dtos/ApiResponseDto";
import { CreateKudosDTO, KudosDTO } from "../../../dtos/KudosDto";
import { EUserRole } from "../../../domain/entities/User";
import { UserDTO } from "../../../dtos/AuthDto";
import { IKudosRepository } from "../../../domain/interfaces/repositories/KudosRepository";
import { IKudosCategoryRepository } from "../../../domain/interfaces/repositories/KudosCategoryRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/UserRepository";
import { ResponseMapper } from "../../../mappers/ResponseMapper";
import { Kudos } from "../../../domain/entities/Kudos";

export class CreateKudos {
  constructor(
    private kudosRepository: IKudosRepository,
    private userRepository: IUserRepository,
    private categoryRepository: IKudosCategoryRepository
  ) {}

  async execute(
    dto: CreateKudosDTO,
    currentUser: UserDTO
  ): Promise<ApiResponseDto<Kudos>> {
    try {
      // Verify the user is a team lead
      if (currentUser.role !== EUserRole.TEAM_LEAD) {
        return ResponseMapper.unauthorized("Only team leads can give kudos");
      }

      // Verify sender is the current user
      if (currentUser.id !== dto.senderId) {
        return ResponseMapper.validationError(
          "Sender ID must match the authenticated user"
        );
      }

      // Verify the receiver exists
      const receiver = await this.userRepository.findByIdWithoutDeleteUser(dto.receiverId);
      if (!receiver) {
        return ResponseMapper.validationError("Receiver not found");
      }

      dto.teamId = receiver.teamId.toString();

      // Verify the category exists
      const category = await this.categoryRepository.getCategoryById(
        dto.categoryId
      );
      if (!category) {
        return ResponseMapper.validationError("Category not found");
      }

      // Create the kudos
      const kudos = await this.kudosRepository.createKudos(dto);

      if (!kudos) {
        return ResponseMapper.serverError(new Error("Failed to create kudos"));
      }

      return ResponseMapper.success(kudos, "Kudos created successfully");
    } catch (error) {
      return ResponseMapper.serverError(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }
}

import { ApiResponseDto } from "../../../dtos/ApiResponseDto";
import { CreateKudosDTO } from "../../../dtos/KudosDto";
import { EUserRole } from "../../../domain/entities/User";
import { UserDTO } from "../../../dtos/AuthDto";
import { IKudosRepository } from "../../../domain/interfaces/repositories/KudosRepository";
import { IKudosCategoryRepository } from "../../../domain/interfaces/repositories/KudosCategoryRepository";
import { IUserRepository } from "../../../domain/interfaces/repositories/UserRepository";
import { ResponseMapper } from "../../../mappers/ResponseMapper";
import { Kudos } from "../../../domain/entities/Kudos";
`
  import { BasecampService } from "../../../services/basecamp";`;
import { ITeamRepository } from "../../../domain/interfaces/repositories/TeamRepository";
import { BasecampService } from "../../../services/basecamp/BaseCampService";
import { EmailService } from "../../../services/email/EmailService";

export class CreateKudos {
  private basecampService: BasecampService;
  private emailService: EmailService;
  constructor(
    private kudosRepository: IKudosRepository,
    private userRepository: IUserRepository,
    private categoryRepository: IKudosCategoryRepository,
    private teamRepository?: ITeamRepository
  ) {
    this.basecampService = new BasecampService();
    this.emailService = new EmailService();
  }

  async execute(
    dto: CreateKudosDTO,
    currentUser: UserDTO
  ): Promise<ApiResponseDto<Kudos>> {
    try {
      if (currentUser.role !== EUserRole.TEAM_LEAD) {
        return ResponseMapper.unauthorized("Only team leads can give kudos");
      }

      if (currentUser.id !== dto.senderId) {
        return ResponseMapper.validationError(
          "Sender ID must match the authenticated user"
        );
      }

      const receiver = await this.userRepository.findByIdWithoutDeleteUser(
        dto.receiverId
      );
      if (!receiver) {
        return ResponseMapper.validationError("Receiver not found");
      }

      dto.teamId = receiver.teamId.toString();

      const category = await this.categoryRepository.getCategoryById(
        dto.categoryId
      );
      if (!category) {
        return ResponseMapper.validationError("Category not found");
      }

      const kudos = await this.kudosRepository.createKudos(dto);

      if (!kudos) {
        return ResponseMapper.serverError(new Error("Failed to create kudos"));
      }

      try {
        let teamName = "Team";
        if (this.teamRepository && kudos.getTeamId()) {
          const team = await this.teamRepository.getTeamById(kudos.getTeamId());
          if (team) {
            teamName = team.getName();
          }
        }

          this.basecampService.sendKudosMessage({
            sender: currentUser.name,
            receiver: receiver.getName(),
            teamName: teamName,
            category: category.getName(),
            message: kudos.getMessage(),
          });

          this.emailService.sendKudosEmail(
            receiver.getEmail(),
            currentUser.name,
            receiver.getName(),
            teamName,
            category.getName(),
            kudos.getMessage()
          );
      } catch (error) {
        console.error("Error sending to Basecamp:", error);
      }

      return ResponseMapper.success(kudos, "Kudos created successfully");
    } catch (error) {
      return ResponseMapper.serverError(
        error instanceof Error ? error : new Error("Unknown error")
      );
    }
  }
}

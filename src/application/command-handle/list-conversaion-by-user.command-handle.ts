import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ListConversationByUserCommand } from "../command/list-conversaion-by-user.command";
import { IUserConversationRepository } from "src/domain/chat/repository/user-conversation.repository";

@CommandHandler(ListConversationByUserCommand)
export class ListConversationByUserCommandHandle implements ICommandHandler<ListConversationByUserCommand> {
  constructor(
    private readonly userConversationRepository: IUserConversationRepository
  ) {}

  async execute(command: ListConversationByUserCommand) {
    return await this.userConversationRepository.listUserConversationPaginate(command.userId, command.page);
  }
}
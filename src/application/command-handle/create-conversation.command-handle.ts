import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateConversationCommand } from "../command/create-conversation.command";
import { IUserRepository } from "src/domain/chat/repository/user.repository";

@CommandHandler(CreateConversationCommand)
export class CreateConversationCommandHandle implements ICommandHandler<CreateConversationCommand> {
  constructor(private userRepository: IUserRepository) {}

  async execute(command: CreateConversationCommand) {
    const { conversationName, listUserId } = command;
    console.log(listUserId);
    console.log(Array.from(new Set(listUserId)));
  }
}
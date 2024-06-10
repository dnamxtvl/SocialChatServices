import { EventsHandler, IEventHandler } from "@nestjs/cqrs"
import { SendMessageSuccessEvent } from "../event/send-message-success.event";
import { IUserConversationRepository } from "src/domain/chat/repository/user-conversation.repository";

@EventsHandler(SendMessageSuccessEvent)
export class HeroKilledDragonHandler implements IEventHandler<SendMessageSuccessEvent> {
  constructor(private readonly userConversationRepository: IUserConversationRepository) {}

  handle(event: SendMessageSuccessEvent) {
    // Business logic
  }
}
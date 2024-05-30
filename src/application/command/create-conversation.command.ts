export class CreateConversationCommand {
    constructor(
      public readonly conversationName: string,
      public readonly listUserId: string[],
    ) {}
  }
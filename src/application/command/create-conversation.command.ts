import { AuthUser } from "src/@type/User";

export class CreateConversationCommand {
    constructor(
      public readonly conversationName: string,
      public readonly listUserId: string[],
      public readonly authUser: AuthUser,
      public readonly avatar?: string
    ) {}
  }
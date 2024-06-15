import { AuthUser } from "src/@type/User";
import { TypeConversationEnum } from "src/const/enums/conversation/type.enum.conversation";

export class CreateConversationCommand {
    constructor(
      public readonly conversationName: string,
      public readonly listUserId: string[],
      public readonly authUser: AuthUser,
      public readonly type: TypeConversationEnum,
      public readonly avatar?: string,
    ) {}
  }
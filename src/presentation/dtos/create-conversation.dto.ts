import { IsArray, IsNotEmpty, IsString, ArrayNotEmpty, ArrayMaxSize, Length, MaxLength, IsEnum } from "class-validator";
import { Type, Transform } from "class-transformer";
import { VALIDATION } from "src/const/validation";
import { TypeConversationEnum } from "src/const/enums/conversation/type.enum.conversation";

export class CreateConversationDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(VALIDATION.CONVERSATION.NAME.MAX_LENGTH)
    name: string

    @IsArray()
    @ArrayNotEmpty()
    @ArrayMaxSize(VALIDATION.CONVERSATION.MAX_COUNT_USER)
    @Type(() => String)
    @IsString({ each: true })
    @Length(VALIDATION.USER.ID_LENGTH, VALIDATION.USER.ID_LENGTH, { each: true })
    listUserId: string[];

    @IsEnum(TypeConversationEnum)
    @Transform(({ value }) => parseInt(value))
    type: number
}
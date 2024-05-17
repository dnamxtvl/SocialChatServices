import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Transform } from 'class-transformer';
import { VALIDATION } from 'src/const/validation';
import { Message } from './message.entity';
import mongoose from 'mongoose';

export enum ConversationTypeEnum {
    SINGLE = 0,
    GROUP = 1
}

export type MessagesDocument = HydratedDocument<Conversation>;

@Schema({
  collection: 'conversations',
})
export class Conversation {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ required: true, type: Types.Array, maxlength: VALIDATION.CONVERSATION.NAME.MAX_LENGTH})
  name: string

  @Prop({ required: true, enum: ConversationTypeEnum })
  type: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
  last_message: Message;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: null })
  deleted_at: Date | null;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
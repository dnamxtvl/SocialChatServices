import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Transform } from 'class-transformer';
import { VALIDATION } from 'src/const/validation';
import { Message } from './message.entity';
import mongoose from 'mongoose';
import { TypeConversationEnum } from 'src/const/enums/conversation/type.enum.conversation';

export type MessagesDocument = HydratedDocument<Conversation>;

@Schema({
  collection: 'conversations',
  versionKey: false,
  timestamps: true,
})
export class Conversation {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true, maxlength: VALIDATION.CONVERSATION.NAME.MAX_LENGTH})
  name: string

  @Prop({ default: null })
  avatar: string | null

  @Prop({ required: true, enum: TypeConversationEnum })
  type: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
  last_message: Message;

  @Prop()
  latest_active_at: Date;

  @Prop()
  created_by: string;

  @Prop()
  organization_id: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: null })
  deletedAt: Date | null;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
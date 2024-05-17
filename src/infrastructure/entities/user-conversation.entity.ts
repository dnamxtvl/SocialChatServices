import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Transform } from 'class-transformer';
import mongoose from 'mongoose';
import { Conversation } from './conversation.entity';

import { TypeMessageEnum } from './message.entity';

export type MessagesDocument = HydratedDocument<UserConversation>;

@Schema({
  collection: 'conversations',
})
export class UserConversation {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ required: true })
  user_id: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
  conversation: Conversation;

  @Prop({ type: Number })
  no_unread_message: number;

  @Prop(raw({
      message_id: Types.ObjectId,
      user_send_id: String,
      user_send_avatar: String,
      type: TypeMessageEnum,
      content: String,
      created_at: Date
  }))
  latest_message: Record<string, any>;

  @Prop({ type: Boolean })
  disabled_notify: boolean;

  @Prop({ type: Date, required: false })
  expired_disabled_notify_at: Date | null;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: null })
  deleted_at: Date | null;
}

export const UserConversationSchema = SchemaFactory.createForClass(UserConversation);
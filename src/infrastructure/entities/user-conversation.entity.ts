import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Transform } from 'class-transformer';
import mongoose from 'mongoose';
import { Conversation } from './conversation.entity';
import { Message } from './message.entity';

export interface LatestUserSendInfo {
  id: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

export type MessagesDocument = HydratedDocument<UserConversation>;

@Schema({
  collection: 'user_conversation',
  versionKey: false,
  timestamps: true,
})
export class UserConversation {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: true })
  user_id: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' })
  conversation: Conversation;

  @Prop({ type: Number })
  no_unread_message: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Message' })
  last_message: Message;

  @Prop({
    type: {
      id: { type: String },
      first_name: { type: String },
      last_name: { type: String },
      avatar: { type: String, nullable: true },
    },
    _id: false, 
    default: null
  })
  latest_user_seen: LatestUserSendInfo | null

  @Prop({default: Date.now})
  latest_active_at: Date;

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
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Transform } from 'class-transformer';
import mongoose from 'mongoose';
import { Conversation } from './conversation.entity';
import { Message } from './message.entity';

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

  @Prop()
  latest_active_at: Date;

  @Prop({ type: Boolean })
  disabled_notify: boolean;

  @Prop({ type: Date, required: false })
  expired_disabled_notify_at: Date | null;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: null })
  deletedAt: Date | null;
}

export const UserConversationSchema = SchemaFactory.createForClass(UserConversation);
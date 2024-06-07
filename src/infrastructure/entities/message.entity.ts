import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Transform } from 'class-transformer';
import mongoose from 'mongoose';
import { Conversation } from './conversation.entity';

export enum StatusMessageEnum {
  UNREAD = 0,
  SEEN = 1,
  DELIVERED = 2,
}

export enum TypeMessageEnum {
  TEXT = 0,
  IMAGE = 1,
  VIDEO = 2,
  AUDIO = 3,
  FILE = 4,
  LINK = 5,
  EMOJI = 6,
  IMAGES = 7,
  FILES = 8,
  VIDEOS = 9,
  NOTIFY = 10
}

export type MessagesDocument = HydratedDocument<Message>;

@Schema({
  collection: 'messages',
  versionKey: false,
  timestamps: true,
})
export class Message {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: false, type: Types.Array })
  content: string | string[];

  @Prop({ required: true, enum: TypeMessageEnum })
  type: number;

  @Prop({
    enum: StatusMessageEnum,
  })
  status: number;

  @Prop()
  user_send_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' })
  conversation: Conversation;

  @Prop({ required: false })
  device_id: string

  @Prop({ required: false })
  latest_user_seen_id: string;

  @Prop({ required: false })
  parent_id: Types.ObjectId | null;

  @Prop({ required: false })
  ip_send: string;

  @Prop({ required: false })
  device_os_id: number;

  @Prop({ default: false })
  first_of_avg_time: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;

  @Prop({ default: null })
  deletedAt: Date | null;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
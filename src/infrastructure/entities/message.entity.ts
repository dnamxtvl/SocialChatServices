import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Transform } from 'class-transformer';
import mongoose from 'mongoose';
import { Conversation } from './conversation.entity';
import { FileContent } from 'src/@type/Message';

export enum StatusMessageEnum {
  SENDING = 0,
  SENT = 1,
  SEEN = 2,
  DELIVERED = 3,
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
})
export class Message {
  @Transform(({ value }) => value.toString())
  _id: Types.ObjectId;

  @Prop({ required: false, type: Types.Array })
  content: string | Array<FileContent> | FileContent;

  @Prop({ required: true, enum: TypeMessageEnum })
  type: number;

  @Prop({
    enum: StatusMessageEnum, default: StatusMessageEnum.SENT,
  })
  status: number;

  @Prop()
  user_send_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' })
  conversation: Conversation;

  @Prop({ default: null })
  device_id: string

  @Prop({ default: null })
  latest_user_seen_id: string;

  @Prop({ default: null })
  parent_id: Types.ObjectId | null;

  @Prop({ default: null })
  ip_send: string;

  @Prop({ default: null })
  device_os_id: number;

  @Prop({ default: false })
  first_of_avg_time: boolean;

  @Prop({ default: Date.now })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: null })
  deleted_at: Date | null;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Transform } from 'class-transformer';

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
})
export class Message {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ required: false, type: Types.Array })
  content: string | string[];

  @Prop({ required: true, enum: TypeMessageEnum })
  type: number;

  @Prop({
    enum: StatusMessageEnum,
  })
  status: number;

  @Prop(
    raw({
      user_id: { type: String },
      user_name: { type: String },
      avatar: { type: String, required: false },
      unit_room_name: { type: String },
      organization_name: { type: String },
    }),
  )
  user_send: Record<string, any>;

  @Prop()
  conversation_id: Types.ObjectId;

  @Prop({ required: false })
  device_id: string

  @Prop(raw({
    user_id: { type: String },
    avatar: { type: String, required: false },
    seen_at: { type: Date },
  }))
  latest_user_seen: Record<string, any>;;

  @Prop({ required: false })
  latest_user_seen_at: Date;

  @Prop({ required: false })
  parent_id: Types.ObjectId | null;

  @Prop({ required: false })
  ip_send: string;

  @Prop({ required: false })
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
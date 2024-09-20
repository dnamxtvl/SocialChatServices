import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { HydratedDocument } from 'mongoose';
import { Transform } from 'class-transformer';
import { VALIDATION } from 'src/const/validation';
import { Message } from './message.entity';
import mongoose from 'mongoose';
import { TypeConversationEnum } from 'src/const/enums/conversation/type.enum.conversation';
import * as moment from 'moment-timezone';

export type MessagesDocument = HydratedDocument<Conversation>;

@Schema({
  collection: 'conversations',
  versionKey: false,
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
  count_member: number;

  @Prop({ default: null })
  about: string;

  @Prop()
  created_by: string;

  @Prop()
  organization_id: number;

  @Prop({ default: moment.tz(new Date(), 'Asia/Ho_Chi_Minh') })
  created_at: Date;

  @Prop({ default: Date.now })
  updated_at: Date;

  @Prop({ default: null })
  deleted_at: Date | null;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
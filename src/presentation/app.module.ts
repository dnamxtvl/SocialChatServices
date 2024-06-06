import { Module, Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepositoryProvider, MessageRepositoryProvider, ConversationRepositoryProvider, UserConversationRepositoryProvider } from './provider';
import { MessageController } from './controller/message.controller';
import { User } from 'src/infrastructure/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/infrastructure/entities/message.entity';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from './middleware/auth.middleware';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConversationController } from './controller/conversation.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateConversationCommandHandle } from 'src/application/command-handle/create-conversation.command-handle';
import { MulterModule } from '@nestjs/platform-express';
import { UserConversation, UserConversationSchema } from 'src/infrastructure/entities/user-conversation.entity';
import { Conversation, ConversationSchema } from 'src/infrastructure/entities/conversation.entity';

const RepositoryProviders: Provider[] = [
  UserRepositoryProvider,
  MessageRepositoryProvider,
  ConversationRepositoryProvider,
  UserConversationRepositoryProvider,
];

export const CommandHandler = [CreateConversationCommandHandle]

@Module({
  imports: [
    MulterModule.register({
      dest: './public/images',
    }),
    CqrsModule,
    ThrottlerModule.forRoot([{
      ttl: process.env.APPLICATION_TTL as any,
      limit: process.env.APPLICATION_RATE_LIMIT as any,
    }]),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.json(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
        new winston.transports.File({
          filename: 'error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.json(),
          ),
        }),
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
      type: process.env.DATABASE_USER_TYPE as any,
      host: process.env.DATABASE_USER_HOST,
      port: process.env.DATABASE_USER_POST as any,
      username: process.env.DATABASE_USER_USER_NAME,
      password: process.env.DATABASE_USER_PASSWORD,
      database: process.env.DATABASE_USER_NAME,
      entities: [User],
      synchronize: false,
    }),
    MongooseModule.forRoot(process.env.DATABASE_CHAT_HOST),
    MongooseModule.forFeature([
      {
        name: Message.name, schema: MessageSchema,
      },
      {
        name: UserConversation.name, schema: UserConversationSchema
      },
      {
        name: Conversation.name, schema: ConversationSchema
      }
  ])
  ],
  controllers: [MessageController, ConversationController],
  providers: [
    ...RepositoryProviders,
    ...CommandHandler
  ],
  exports: [...RepositoryProviders],
})

export class AppModule {
  constructor(
    @InjectDataSource()
      private dataSource: DataSource
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('*');
  }
}

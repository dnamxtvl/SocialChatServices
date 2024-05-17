import { Module, Provider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepositoryProvider } from './provider';
import { MessageController } from './controller/message.controller';
import { User } from 'src/infrastructure/entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/infrastructure/entities/message.entity';

const RepositoryProviders: Provider[] = [
  UserRepositoryProvider,
];

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '192.168.0.99',
      port: 3308,
      username: 'root',
      password: 'root',
      database: 'laravel_social_user',
      entities: [User],
      synchronize: false,
    }),
    MongooseModule.forRoot('mongodb://192.168.0.99:27017/social_chat'),
    MongooseModule.forFeature([{
      name: Message.name, schema: MessageSchema
    }])
  ],
  controllers: [MessageController],
  providers: [
    ...RepositoryProviders
  ],
  exports: [...RepositoryProviders],
})

export class AppModule {
  constructor(
    @InjectDataSource()
      private dataSource: DataSource
  ) {}
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './presentation/app.module';
import { AuthMiddleware } from './presentation/middleware/auth.middleware';
import { HttpExceptionFilter } from './presentation/filter/http-exception.filter';
import { ValidationPipeCustom } from './presentation/pipe/validation.pipe';
const express = require('express');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/chat');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  app.use("/public", express.static("public"));
  app.use(new AuthMiddleware().use);
  app.useGlobalPipes(new ValidationPipeCustom());
  await app.listen(3003);
}
bootstrap();

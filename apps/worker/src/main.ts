import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule);
  Logger.log('🧠 Worker started and listening for jobs');
}
bootstrap();

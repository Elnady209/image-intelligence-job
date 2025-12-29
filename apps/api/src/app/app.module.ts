import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/image-intelligence'),
    ImageModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

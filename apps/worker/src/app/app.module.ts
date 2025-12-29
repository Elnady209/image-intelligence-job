import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageModule } from './image.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/image-intelligence'),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'image-processing',
    }),
    ImageModule,
  ],
  providers: [],
})
export class AppModule {}

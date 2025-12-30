import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageAnalysisSchemaClass, ImageAnalysisSchema } from './schemas/image-analysis.schema';
import { ImageProcessor } from './processors/image.processor';
import { ImageAnalyzerService } from './services/image.analyzer';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImageAnalysisSchemaClass.name, schema: ImageAnalysisSchema },
    ]),
    BullModule.registerQueue({
      name: 'image-processing',
    }),
  ],
  providers: [ImageProcessor, ImageAnalyzerService],
  exports: [ImageAnalyzerService],
})
export class ImageModule {}

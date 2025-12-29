import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageAnalysis, ImageAnalysisSchema } from '../image-analysis.schema';
import { ImageProcessor } from '../image.processor';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ImageAnalysis.name,
        schema: ImageAnalysisSchema,
      },
    ]),
  ],
  providers: [ImageProcessor],
})
export class ImageModule {}

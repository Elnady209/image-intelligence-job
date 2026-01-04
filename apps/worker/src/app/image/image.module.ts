import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageAnalysisSchemaClass, ImageAnalysisSchema } from './schemas/image-analysis.schema';
import { ImageProcessor } from './processors/image.processor';
import { ImageAnalyzerService } from './services/image.analyzer';
import { MinioClientProvider } from './infrastructure/storage/minio.provider';
import { MinioImageStorageService } from './infrastructure/storage/image-storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImageAnalysisSchemaClass.name, schema: ImageAnalysisSchema },
    ]),
    BullModule.registerQueue({
      name: 'image-processing',
    }),
  ],
  providers: [ImageProcessor, MinioClientProvider, ImageAnalyzerService, {
    provide: 'ImageStorage',
    useClass: MinioImageStorageService,
},],
  exports: [ImageAnalyzerService],
})
export class ImageModule {}

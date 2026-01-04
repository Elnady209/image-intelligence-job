import { Logger, Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageAnalysisSchemaClass, ImageAnalysisSchema } from './infrastructure/persistence/image-analysis.schema';
import { ImageService } from './image.service';
import { MinioImageStorageService } from './infrastructure/storage/image-storage.service';
import { MinioClientProvider } from './infrastructure/storage/minio.provider';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ImageAnalysisSchemaClass.name, schema: ImageAnalysisSchema },
        ]),
    ],
    controllers: [ImageController],
    providers: [ImageService, MinioClientProvider, Logger,
        {
            provide: 'ImageStorage',
            useClass: MinioImageStorageService,
        },
    ],
})
export class ImageModule {}

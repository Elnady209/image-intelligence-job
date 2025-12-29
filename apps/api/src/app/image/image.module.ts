import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ImageAnalysis, ImageAnalysisSchema } from './schemas/image-analysis.schema';
import { ImageService } from './image.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ImageAnalysis.name, schema: ImageAnalysisSchema },
        ]),
    ],
    controllers: [ImageController],
    providers: [ImageService],
})
export class ImageModule {}

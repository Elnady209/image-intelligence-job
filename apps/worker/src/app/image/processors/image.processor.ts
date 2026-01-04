import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { InjectModel } from '@nestjs/mongoose';
import { Inject, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { ImageAnalyzerService } from '../services/image.analyzer';
import { ImageAnalysisSchemaClass } from '../schemas/image-analysis.schema';
import type { ImageStorage } from '../infrastructure/storage/image-storage.service';

@Processor('image-processing')
export class ImageProcessor extends WorkerHost {
  private readonly logger = new Logger(ImageProcessor.name);

  constructor(
    private readonly analyzer: ImageAnalyzerService,
    @InjectModel(ImageAnalysisSchemaClass.name)
    private readonly imageModel: Model<ImageAnalysisSchemaClass>,
    @Inject('ImageStorage')
    private readonly storage: ImageStorage,
  ) {
    super();
  }

  async process(job: Job<{ bucket: string; filename: string }>) {
    this.logger.log(
      `Processing job ${job.id} for file ${job.data.filename}`,
    );

    const { bucket, filename } = job.data;

    const stream = await this.storage.getObject(filename);
    const buffer = await this.streamToBuffer(stream);

    const analysis = await this.analyzer.analyze(buffer);

    await this.imageModel.create({
      filename,
      bucket,
      metadata: {
        format: analysis.format,
        size: analysis.size,
        width: analysis.width,
        height: analysis.height,
        aspectRatio: analysis.aspectRatio,
        orientation: analysis.orientation,
        hasAlpha: analysis.hasAlpha,
        dominantColor: analysis.dominantColor,
      },
      palette: analysis.palette,
      brightness: analysis.brightness,
      hash: analysis.hash,
    });

    this.logger.log(`Job ${job.id} completed successfully`);
    return { filename };
  }

  private streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}

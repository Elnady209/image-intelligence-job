import { Processor, WorkerHost } from '@nestjs/bullmq';
import { minioClient } from '@image-intelligence-v2/storage';
import { Job } from 'bullmq';
import { analyzeImage } from './image.analyzer';
import { extractPalette } from './image.palette';
import { ImageAnalysis } from './image-analysis.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

@Processor('image-processing')
export class ImageProcessor extends WorkerHost {

  constructor(
    @InjectModel(ImageAnalysis.name)
    private readonly imageModel: Model<ImageAnalysis>,
  ) {
    super();
  }

  async process(job: Job) {
    const { bucket, filename } = job.data;

    console.log('🖼️ Processing image:', filename);

    const stream = await minioClient.getObject(bucket, filename);
    const buffer = await streamToBuffer(stream);

    console.log('buffer ok:', buffer.length);

    const palette = await extractPalette(buffer, {
      size: 50,
      colors: 3,
    });

    console.log('📊 Palette:', palette);

    const analysis = await analyzeImage(buffer);

    console.log('📊 Analysis:', analysis);

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
      palette,
      brightness: analysis.brightness,
      hash: analysis.hash,
    });

    return {
      filename,
      palette,
      analysis,
    };
  }
}

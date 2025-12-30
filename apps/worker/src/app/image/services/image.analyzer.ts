import { Injectable, Logger  } from '@nestjs/common';
import sharp from 'sharp';
import { extractPalette } from './image.palette';

@Injectable()
export class ImageAnalyzerService {
  private readonly logger = new Logger(ImageAnalyzerService.name);

  async analyze(buffer: Buffer) {
    this.logger.debug('Starting image analysis');
    const image = sharp(buffer);
    const metadata = await image.metadata();

    const palette = await extractPalette(buffer, {
      size: 50,
      colors: 3,
    });

    const width = metadata.width ?? 0;
    const height = metadata.height ?? 0;

    const aspectRatio = width && height ? width / height : 0;
    const orientation =
    width === height
      ? 'square'
      : width > height
      ? 'landscape'
      : 'portrait';

    this.logger.debug('Image analysis completed');
    return {
      format: metadata.format,
      size: metadata.size,
      width: metadata.width,
      height: metadata.height,
      aspectRatio,
      orientation,
      hasAlpha: metadata.hasAlpha,
      dominantColor: palette[0],
      brightness: this.calculateBrightness(palette),
      hash: await image.toBuffer().then(buf => this.hash(buf)),
      palette,
    };
  }

  private calculateBrightness(palette: { r: number; g: number; b: number }[]) {
    const avg =
      palette.reduce((acc, c) => acc + (c.r + c.g + c.b) / 3, 0) /
      palette.length;

    return avg > 128 ? 'bright' : 'dark';
  }

  private async hash(buffer: Buffer) {
    const crypto = await import('crypto');
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }
}

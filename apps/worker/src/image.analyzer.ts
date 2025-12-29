import sharp from 'sharp';
import crypto from 'crypto';

function calculateLuminance(r: number, g: number, b: number): number {
    return (
      0.2126 * r +
      0.7152 * g +
      0.0722 * b
    ) / 255;
}

export async function analyzeImage(buffer: Buffer) {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const stats = await image.stats();

  const width = metadata.width ?? 0;
  const height = metadata.height ?? 0;

  const aspectRatio = width && height ? width / height : 0;

  const orientation =
    width === height
      ? 'square'
      : width > height
      ? 'landscape'
      : 'portrait';

  const dominant = stats.dominant;
  const luminance = calculateLuminance(
    dominant.r,
    dominant.g,
    dominant.b
  );

  const hash = crypto
    .createHash('sha256')
    .update(buffer)
    .digest('hex');

  return {
    format: metadata.format,
    size: metadata.size,
    width,
    height,
    aspectRatio,
    orientation,
    hasAlpha: metadata.hasAlpha,
    dominantColor: {
      r: dominant.r,
      g: dominant.g,
      b: dominant.b,
    },
    brightness:
      luminance > 0.7
        ? 'bright'
        : luminance < 0.3
        ? 'dark'
        : 'normal',
    hash,
  };
}

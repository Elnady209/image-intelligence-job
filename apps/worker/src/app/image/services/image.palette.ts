/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createCanvas, loadImage } from 'canvas';

type RGB = { r: number; g: number; b: number };

export async function extractPalette(
  buffer: Buffer,
  options = { size: 64, colors: 5 }
): Promise<RGB[]> {
  const img = await loadImage(buffer);

  const canvas = createCanvas(options.size, options.size);
  const ctx = canvas.getContext('2d');

  ctx.drawImage(img, 0, 0, options.size, options.size);

  const { data } = ctx.getImageData(0, 0, options.size, options.size);
  const colorMap = new Map<string, { color: RGB; count: number }>();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 200) continue;
    if (r + g + b < 60) continue;
    if (r + g + b > 740) continue;

    const qr = Math.round(r / 32) * 32;
    const qg = Math.round(g / 32) * 32;
    const qb = Math.round(b / 32) * 32;

    const key = `${qr},${qg},${qb}`;

    if (!colorMap.has(key)) {
      colorMap.set(key, { color: { r: qr, g: qg, b: qb }, count: 0 });
    }

    colorMap.get(key)!.count++;
  }

  return [...colorMap.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, options.colors)
    .map(c => c.color);
}

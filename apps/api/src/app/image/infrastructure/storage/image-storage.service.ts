import { minioClient, IMAGE_BUCKET } from "@image-intelligence-v2/storage";
import { Injectable } from "@nestjs/common";

export interface ImageStorage {
    getPresignedUrl(filename: string): Promise<string>;
    upload(filename: string, buffer: Buffer): Promise<void>;
}

@Injectable()
export class MinioImageStorageService implements ImageStorage {
  async getPresignedUrl(filename: string): Promise<string> {
    return minioClient.presignedGetObject(
      IMAGE_BUCKET,
      filename,
      60 * 60,
    );
  }

  async upload(filename: string, buffer: Buffer): Promise<void> {
    await minioClient.putObject(
      IMAGE_BUCKET,
      filename,
      buffer,
    );
  }
}

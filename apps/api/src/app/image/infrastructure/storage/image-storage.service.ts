import { Injectable, Inject } from '@nestjs/common';
import { Client } from 'minio';
import { IMAGE_BUCKET } from '@image-intelligence-v2/storage';

export interface ImageStorage {
  getPresignedUrl(filename: string): Promise<string>;
  upload(filename: string, buffer: Buffer): Promise<void>;
  delete(filename: string): Promise<void>;
}

@Injectable()
export class MinioImageStorageService implements ImageStorage {
  constructor(
    @Inject('MINIO_CLIENT')
    private readonly minio: Client,
  ) {}

  async getPresignedUrl(filename: string): Promise<string> {
    return this.minio.presignedGetObject(
      IMAGE_BUCKET,
      filename,
      60 * 60,
    );
  }

  async upload(filename: string, buffer: Buffer): Promise<void> {
    await this.minio.putObject(
      IMAGE_BUCKET,
      filename,
      buffer,
    );
  }

  async delete(filename: string): Promise<void> {
    await this.minio.removeObject(
      IMAGE_BUCKET,
      filename,
    );
  }
}

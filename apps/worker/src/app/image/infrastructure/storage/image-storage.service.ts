import { Injectable, Inject } from '@nestjs/common';
import { Client } from 'minio';
import { IMAGE_BUCKET } from '@image-intelligence-v2/storage';
import Stream from 'stream';

export interface ImageStorage {
  getObject(filename: string): Promise<Stream.Readable>;
}

@Injectable()
export class MinioImageStorageService implements ImageStorage {
  constructor(
    @Inject('MINIO_CLIENT')
    private readonly minio: Client,
  ) {}

  async getObject(filename: string): Promise<Stream.Readable> {
    return this.minio.getObject(
      IMAGE_BUCKET,
      filename,
    );
  }
}

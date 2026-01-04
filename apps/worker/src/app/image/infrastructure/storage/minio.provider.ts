import { createMinioClient } from '@image-intelligence-v2/storage';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const MinioClientProvider: Provider = {
  provide: 'MINIO_CLIENT',
  inject: [ConfigService],
  useFactory: (config: ConfigService) =>
    createMinioClient({
        endPoint: config.get('MINIO_ENDPOINT')!,
        port: config.get<number>('MINIO_PORT')!,
        useSSL: config.get('MINIO_SSL') === 'true'!,
        accessKey: config.get('MINIO_ACCESS_KEY')!,
        secretKey: config.get('MINIO_SECRET_KEY')!,
    }),
};

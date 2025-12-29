/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller, Post, Get, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { imageQueue } from '@image-intelligence-v2/queue';
import { minioClient, IMAGE_BUCKET } from '@image-intelligence-v2/storage';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';

@Controller('images')
export class ImageController {

  constructor(private readonly imageService: ImageService) {}

  @Get()
  async list() {
    return this.imageService.findAll();
  }

  @Get(':id')
  async getOne(@Param('id') id: string) {
    return this.imageService.findById(id);
  }

  @Post("upload")
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: any) {
    const filename = `${Date.now()}-${file.originalname}`;

    await minioClient.putObject(
        IMAGE_BUCKET,
        filename,
        file.buffer,
    );
  
    await imageQueue.add('image-processing', {
        bucket: IMAGE_BUCKET,
        filename,
    });

    return { status: 'queued', filename };
  }
}

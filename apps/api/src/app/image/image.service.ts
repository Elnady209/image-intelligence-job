import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ImageAnalysis } from './schemas/image-analysis.schema';

@Injectable()
export class ImageService {
  constructor(
    @InjectModel(ImageAnalysis.name)
    private readonly imageModel: Model<ImageAnalysis>,
  ) {}

  async findAll() {
    return this.imageModel
      .find()
      .sort({ createdAt: -1 })
      .lean();
  }

  async findById(id: string) {
    return this.imageModel.findById(id).lean();
  }
}

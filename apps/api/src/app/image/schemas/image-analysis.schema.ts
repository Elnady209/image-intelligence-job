/* eslint-disable @typescript-eslint/no-explicit-any */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ImageAnalysis extends Document {
  @Prop({ required: true })
  filename!: string;

  @Prop()
  bucket!: string;

  @Prop({ type: Object })
  metadata!: Record<string, any>;

  @Prop({ type: Array })
  palette!: { r: number; g: number; b: number }[];

  @Prop()
  brightness!: string;

  @Prop()
  hash!: string;
}

export const ImageAnalysisSchema =
  SchemaFactory.createForClass(ImageAnalysis);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { VehicleStatus } from './vehicles.type';

export type VehiclesDocument = HydratedDocument<Vehicle>;

@Schema({
  collection: 'vehicles',
  timestamps: true,
})
export class Vehicle {
  @Prop({
    required: true,
    trim: true,
    uppercase: true,
    unique: true,
    index: true,
    maxlength: 7,
  })
  plate!: string;

  @Prop({ required: true, trim: true, maxlength: 60, index: true })
  brand!: string;

  @Prop({ required: true, trim: true, maxlength: 80, index: true })
  model!: string;

  @Prop({ type: String, trim: true, maxlength: 80, default: null })
  version?: string | null;

  @Prop({ required: true, min: 1900, max: 2100, index: true })
  year!: number;

  @Prop({ type: String, trim: true, maxlength: 40, index: true, default: null })
  category?: string | null;

  @Prop({ type: String, trim: true, maxlength: 30, index: true, default: null })
  fuel?: string | null;

  @Prop({ type: String, trim: true, maxlength: 30, index: true, default: null })
  transmission?: string | null;

  @Prop({ min: 2, max: 9, default: 5 })
  seats!: number;

  @Prop({ min: 2, max: 5, default: 4 })
  doors!: number;

  @Prop({ type: String, trim: true, maxlength: 30, index: true, default: null })
  color?: string | null;

  @Prop({ required: true, min: 0, index: true })
  dailyRateCents!: number;

  @Prop({
    required: true,
    enum: VehicleStatus,
    default: VehicleStatus.AVAILABLE,
    index: true,
  })
  status!: VehicleStatus;

  @Prop({ default: true, index: true })
  isActive!: boolean;

  @Prop({ type: String, default: null, maxlength: 500 })
  notes?: string | null;

  @Prop({ type: [String], default: [] })
  imageUrls!: string[];

  @Prop({ default: 1 })
  _schemaVersion: number;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

VehicleSchema.index({ plate: 1 }, { unique: true });
VehicleSchema.index({ brand: 1, model: 1, year: 1 });
VehicleSchema.index({ status: 1, isActive: 1 });
VehicleSchema.index({ category: 1, dailyRateCents: 1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { ReservationStatus } from './reservation.types';
import { Vehicle } from '../vehicles/vehicle.schema';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ type: Types.ObjectId, required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: Vehicle.name, required: true })
  vehicleId: string;

  @Prop({ enum: ReservationStatus, default: ReservationStatus.ACTIVE })
  status: ReservationStatus;

  @Prop({ default: 1 })
  _schemaVersion: number;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);

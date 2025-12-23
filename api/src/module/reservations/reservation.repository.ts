import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation } from './reservation.schema';
import { ReservationStatus } from './reservation.types';

export class ReservationRepository {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservations: Model<Reservation>,
  ) {}

  create(input: Reservation) {
    return this.reservations.create(input);
  }

  findActiveByVehicle(vehicleId: string) {
    return this.reservations.findOne({
      vehicleId,
      status: ReservationStatus.ACTIVE,
    });
  }

  findActiveByUser(userId: string) {
    return this.reservations.findOne({
      userId,
      status: ReservationStatus.ACTIVE,
    });
  }

  findByUser(userId: string) {
    return this.reservations.find({ userId });
  }

  finish(reservationId: string) {
    return this.reservations.updateOne(
      { _id: reservationId },
      { status: ReservationStatus.FINISHED },
    );
  }

  cancel(reservationId: string) {
    return this.reservations.updateOne(
      { _id: reservationId },
      { status: ReservationStatus.CANCELED },
    );
  }
}

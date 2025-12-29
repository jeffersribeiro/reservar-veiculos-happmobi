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

  async findByUser(userId: string) {
    return (
      await this.reservations
        .find({ userId })
        .populate({
          path: 'vehicleId',
          select: {
            plate: 1,
            brand: 1,
            model: 1,
            year: 1,
            category: 1,
            imageUrls: 1,
            dailyRate: 1,
          },
        })
        .lean()
    ).map(({ vehicleId, ...rest }) => ({
      ...rest,
      vehicle: vehicleId, // renomeia
    }));
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

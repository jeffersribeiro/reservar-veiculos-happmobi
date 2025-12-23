import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ReservationService } from './reservations.service';
import { ReservationRepository } from './reservation.repository';
import { ReservationController } from './reservations.controller';
import { Reservation, ReservationSchema } from './reservation.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
  ],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationRepository],
})
export class ReservationsModule {}

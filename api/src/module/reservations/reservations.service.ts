import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { Reservation } from './reservation.schema';

@Injectable()
export class ReservationService {
  constructor(private readonly repository: ReservationRepository) {}

  async reserveVehicle(userId: string, vehicleId: string) {
    // Regra 1: veículo já reservado
    const vehicleReserved =
      await this.repository.findActiveByVehicle(vehicleId);

    if (vehicleReserved) {
      throw new ConflictException('Vehicle is already reserved');
    }

    // Regra 2: usuário já tem reserva ativa
    const userReserved = await this.repository.findActiveByUser(userId);

    if (userReserved) {
      throw new ConflictException('User already has an active reservation');
    }

    return this.repository.create({
      userId,
      vehicleId,
    } as Reservation);
  }

  async finishReservation(reservationId: string) {
    const result = await this.repository.finish(reservationId);

    if (result.modifiedCount === 0) {
      throw new NotFoundException('Reservation not found');
    }
  }

  async cancelReservation(reservationId: string) {
    const result = await this.repository.cancel(reservationId);

    if (result.modifiedCount === 0) {
      throw new NotFoundException('Reservation not found');
    }
  }

  listUserReservations(userId: string) {
    return this.repository.findByUser(userId);
  }
}

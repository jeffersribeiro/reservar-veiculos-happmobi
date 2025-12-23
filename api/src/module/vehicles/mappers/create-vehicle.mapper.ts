import { BadRequestException } from '@nestjs/common';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { Vehicle } from '../vehicle.schema';
import { VehicleStatus } from '../vehicles.type';

export class CreateVehicleMapper {
  static map(dto: CreateVehicleDto): Vehicle {
    const v = new Vehicle();

    v.plate = dto.plate.trim().toUpperCase();
    v.brand = dto.brand.trim();
    v.model = dto.model.trim();
    v.year = dto.year;

    v.dailyRateCents = this.brlToCents(dto.dailyRate);

    v.color = this.toNullableTrim(dto.color);

    v.status = dto.status ?? VehicleStatus.AVAILABLE;

    v.isActive = true;
    v.seats = 5;
    v.doors = 4;
    v.imageUrls = [];
    v._schemaVersion = 1;

    v.version = null;
    v.category = null;
    v.fuel = null;
    v.transmission = null;
    v.notes = null;

    return v;
  }

  private static toNullableTrim(value?: string): string | null {
    if (value === undefined || value === null) return null;
    const s = String(value).trim();
    return s.length ? s : null;
  }

  /**
   * Converts BRL (number) to cents (int) safely.
   * Ex: 199.9 => 19990
   */
  private static brlToCents(value: number): number {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      throw new BadRequestException('dailyRate must be a valid number');
    }
    if (value <= 0) {
      throw new BadRequestException('dailyRate must be greater than 0');
    }

    const cents = Math.round(value * 100);

    if (!Number.isSafeInteger(cents) || cents < 0) {
      throw new BadRequestException('dailyRate is out of valid range');
    }

    return cents;
  }
}

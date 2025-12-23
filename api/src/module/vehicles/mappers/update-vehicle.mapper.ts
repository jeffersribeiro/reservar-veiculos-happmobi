import { BadRequestException } from '@nestjs/common';
import { Vehicle } from '../vehicle.schema';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';

export class UpdateVehicleMapper {
  static map(vehicle: Vehicle, dto: UpdateVehicleDto): Vehicle {
    if (dto.plate !== undefined) vehicle.plate = dto.plate.trim().toUpperCase();
    if (dto.brand !== undefined) vehicle.brand = dto.brand.trim();
    if (dto.model !== undefined) vehicle.model = dto.model.trim();

    if (dto.year !== undefined) vehicle.year = dto.year;

    if (dto.dailyRateCents !== undefined) {
      vehicle.dailyRateCents = this.brlToCents(dto.dailyRateCents);
    }

    if (dto.status !== undefined) vehicle.status = dto.status;

    if (dto.color !== undefined) vehicle.color = this.toNullableTrim(dto.color);

    return vehicle;
  }

  private static toNullableTrim(value?: string | null): string | null {
    if (value === undefined || value === null) return null;
    const s = String(value).trim();
    return s.length ? s : null;
  }

  private static toNullableUpper(value?: string | null): string | null {
    const s = this.toNullableTrim(value);
    return s ? s.toUpperCase() : null;
  }

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

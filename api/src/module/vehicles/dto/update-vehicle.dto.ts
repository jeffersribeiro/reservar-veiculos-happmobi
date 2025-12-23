import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Max,
  Min,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { VehicleStatus } from '../vehicles.type';

export class UpdateVehicleDto {
  @ApiPropertyOptional({ example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value).trim())
  brand!: string;

  @ApiPropertyOptional({ example: 'Corolla' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value).trim())
  model!: string;

  @ApiPropertyOptional({
    example: 'ABC1D23',
    description: 'Plate in Brazilian Mercosul format (e.g., ABC1D23)',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value).trim().toUpperCase())
  @Matches(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, {
    message: 'plate must be in Mercosul format (e.g., ABC1D23)',
  })
  plate: string;

  @ApiPropertyOptional({ example: 2023, minimum: 1900, maximum: 2100 })
  @IsInt()
  @IsNotEmpty()
  @Min(1900)
  @Max(2100)
  year: number;

  @ApiPropertyOptional({ example: 'Black' })
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => String(value).trim())
  color!: string;

  @ApiPropertyOptional({ example: 249.9 })
  @IsNotEmpty()
  @IsPositive()
  dailyRateCents!: number;

  @ApiPropertyOptional({
    enum: VehicleStatus,
    example: VehicleStatus.AVAILABLE,
  })
  @IsNotEmpty()
  @IsEnum(VehicleStatus)
  status!: VehicleStatus;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  Matches,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { VehicleStatus } from '../vehicles.type';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value).trim())
  brand!: string;

  @ApiProperty({ example: 'Corolla' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value).trim())
  model!: string;

  @ApiProperty({
    example: 'ABC1D23',
    description: 'Plate in Brazilian Mercosul format (e.g., ABC1D23)',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => String(value).trim().toUpperCase())
  @Matches(/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/, {
    message: 'plate must be in Mercosul format (e.g., ABC1D23)',
  })
  plate!: string;

  @ApiProperty({ example: 2022, minimum: 1900, maximum: 2100 })
  @IsInt()
  @Min(1900)
  @Max(2100)
  @Transform(({ value }) => Number(value))
  year!: number;

  @ApiPropertyOptional({ example: 'Blue' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => String(value).trim())
  color?: string;

  @ApiProperty({ example: 199.9, description: 'Daily rate in BRL' })
  @IsPositive()
  @Transform(({ value }) => Number(value))
  dailyRate!: number;

  @ApiPropertyOptional({
    enum: VehicleStatus,
    example: VehicleStatus.AVAILABLE,
    default: VehicleStatus.AVAILABLE,
  })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { VehiclesRepository } from './vehicles.repository';
import { ListAvailableVehiclesInput } from './vehicles.type';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { Vehicle } from './vehicle.schema';
import { UploadService } from './services/upload.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { CreateVehicleMapper } from './mappers/create-vehicle.mapper';

@Injectable()
export class VehiclesService {
  constructor(
    private readonly uploadService: UploadService,
    private readonly repo: VehiclesRepository,
  ) {}

  async getById(id: string) {
    const vehicle = await this.repo.finOneById(id);
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    return vehicle;
  }

  async createVehicle(
    body: CreateVehicleDto,
    images: Express.Multer.File[],
  ): Promise<{ id: string }> {
    const UploadResult = await this.uploadService.saveBatch(images);
    const imageUrls = UploadResult.map((result) => result.url);

    const vehicle = CreateVehicleMapper.map(body);

    vehicle.imageUrls = imageUrls;

    const id = await this.repo.create(vehicle);
    return { id };
  }

  async updateVehicle(
    id: string,
    body: UpdateVehicleDto,
    images: Express.Multer.File[],
  ): Promise<{ updated: true }> {
    const vehicle = await this.repo.finOneById(id);

    if (!vehicle) throw new NotFoundException('Vehicle not found');

    await this.uploadService.deleteBatch(vehicle.imageUrls);

    const UploadResult = await this.uploadService.saveBatch(images);

    const imageUrls = UploadResult.map((result) => result.url);

    vehicle.imageUrls = imageUrls;
    vehicle.brand = body.brand;
    vehicle.model = body.model;
    vehicle.plate = body.plate;
    vehicle.year = body.year;
    vehicle.color = body.color;
    vehicle.dailyRateCents = body.dailyRateCents;
    vehicle.status = body.status;

    await this.repo.updateById(id, vehicle);

    return { updated: true };
  }

  async removeVehicle(id: string): Promise<{ removed: true }> {
    const vehicle = await this.repo.finOneById(id);

    if (!vehicle) throw new NotFoundException('Vehicle not found');

    await this.uploadService.deleteBatch(vehicle.imageUrls);

    await this.repo.removeById(id);
    return { removed: true };
  }

  async listAvailable(
    input: ListAvailableVehiclesInput = {},
  ): Promise<Vehicle[]> {
    return this.repo.listAvailable(input);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model, QueryFilter, UpdateQuery } from 'mongoose';
import { ListAvailableVehiclesInput, VehicleStatus } from './vehicles.type';
import { Vehicle } from './vehicle.schema';

@Injectable()
export class VehiclesRepository {
  constructor(
    @InjectModel(Vehicle.name)
    private readonly vehicles: Model<Vehicle>,
  ) {}

  async finOneById(vehicleId: string): Promise<Vehicle | null> {
    const doc = await this.vehicles.findById(vehicleId);
    return doc;
  }

  async create(input: Vehicle): Promise<string> {
    const doc = await this.vehicles.create({
      ...input,
      isActive: true,
      status: input.status ?? VehicleStatus.AVAILABLE,
    });

    return String(doc._id);
  }

  async updateById(id: string, input: Vehicle): Promise<boolean> {
    const update: UpdateQuery<Vehicle> = {
      $set: {
        ...input,
        updatedAt: new Date(),
      },
    };

    if (Object.keys(update.$set ?? {}).length === 0) return false;

    const res = await this.vehicles.updateOne(
      { _id: id, isActive: true },
      update,
    );

    return (res.modifiedCount ?? 0) > 0;
  }

  async removeById(id: string): Promise<boolean> {
    const res = await this.vehicles.updateOne(
      { _id: id, isActive: true },
      { $set: { isActive: false, status: 'INACTIVE', updatedAt: new Date() } },
    );

    return (res.modifiedCount ?? 0) > 0;
  }

  async listAvailable(
    input: ListAvailableVehiclesInput = {},
  ): Promise<Vehicle[]> {
    const {
      category,
      brand,
      model,
      plate,
      minDailyPrice,
      maxDailyPrice,
      skip = 0,
      limit = 50,
    } = input;

    const query: QueryFilter<Vehicle> = {
      status: VehicleStatus.AVAILABLE as VehicleStatus,

      isActive: true,
    };

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (model) query.model = model;

    if (plate) {
      query.plate = { $regex: plate.trim(), $options: 'i' };
    }

    if (minDailyPrice != null || maxDailyPrice != null) {
      query.dailyPrice = {};
      if (minDailyPrice != null) query.dailyPrice.$gte = minDailyPrice;
      if (maxDailyPrice != null) query.dailyPrice.$lte = maxDailyPrice;
    }

    const safeLimit = Math.min(Math.max(limit, 1), 200);
    const safeSkip = Math.max(skip, 0);

    return this.vehicles
      .find(query)
      .sort({ createdAt: -1 })
      .skip(safeSkip)
      .limit(safeLimit)
      .lean(false);
  }
}

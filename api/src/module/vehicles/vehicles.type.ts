export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE',
}

export interface ListAvailableVehiclesInput {
  category?: string;
  brand?: string;
  model?: string;
  plate?: string;
  minDailyPrice?: number;
  maxDailyPrice?: number;

  skip?: number;
  limit?: number;
}

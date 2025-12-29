export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  RENTED = 'RENTED',
  MAINTENANCE = 'MAINTENANCE',
  INACTIVE = 'INACTIVE',
}

export interface ListAvailableVehiclesInput {
  category?: string[];
  seats?: string[];
  engineSizes?: string[];

  skip?: number;
  limit?: number;
}

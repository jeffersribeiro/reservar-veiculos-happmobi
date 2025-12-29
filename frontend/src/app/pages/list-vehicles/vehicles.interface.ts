export type Vehicle = {
  _id: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  transmission?: string | null;
  description: string;
  color: string;
  dailyRate: number;
  engineSizes: string;
  seats: number;
  status: 'AVAILABLE' | 'RESERVED' | 'INACTIVE';
  imageUrls: string[];
};

export type VehicleGroup = {
  category: string;
  vehicles: Vehicle[];
};

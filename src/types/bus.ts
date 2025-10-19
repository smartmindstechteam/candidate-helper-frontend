// Bus Model
export interface Bus {
  id: number;
  licensePlate: string;
  busNumber: string;
  model: string;
  type: string;
  color: string;
  capacity: number;
  costPerKm: number; // Decimal(10, 2)
  profession: string;
  status: string; // Defaults to "active"
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  // Relations
  drivers: BusDriver[];
  schedules: BusSchedule[];
}

// BusDriver Model
export interface BusDriver {
  id: number;
  assignedBusId: number | null;
  name: string;
  license: string;
  phone: string;
  status: string; // Defaults to "active"
  createdAt: Date;
  updatedAt: Date;

  // Relations
  assignedBus: Bus | null;
}

// BusRoute Model
export interface BusRoute {
  id: number;
  name: string;
  startPoint: string;
  endPoint: string;
  distance: number | null; // Decimal(10, 2)
  duration: number | null; // in minutes
  createdAt: Date;
  updatedAt: Date;

  // Relations
  schedules: BusSchedule[];
}

// BusSchedule Model
export interface BusSchedule {
  id: number;
  busId: number;
  routeId: number;
  startTime: Date;
  endTime: Date;
  status: string; // Defaults to "scheduled"
  createdAt: Date;
  updatedAt: Date;

  // Relations
  bus: Bus;
  route: BusRoute;
}
// Bus/Transport API implementation with comprehensive CRUD operations
import { api } from './api';
import { Bus, Route, Schedule, Driver, BusAnalytics } from './bus';

export class BusApiService {
  // ============ BUS OPERATIONS ============
  
  // Get all buses with advanced filtering and pagination
  async getAllBuses(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    busType?: string;
    fuelType?: string;
    isGpsEnabled?: boolean;
    hasWifi?: boolean;
    hasAirConditioning?: boolean;
    isAccessible?: boolean;
  }) {
    try {
      const response = await api.bus.getAllBuses(params);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        message: api.utils.handleError(error),
      };
    }
  }

  // Get single bus by ID with related data
  async getBusById(id: string) {
    try {
      const response = await api.bus.getBusById(id);
      return {
        success: true,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Create new bus with validation
  async createBus(data: Omit<Bus, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      // Validate required fields
      if (!data.busNumber || !data.plateNumber || !data.model || !data.manufacturer) {
        throw new Error('Missing required fields: busNumber, plateNumber, model, manufacturer');
      }

      // Validate capacity
      if (data.capacity <= 0) {
        throw new Error('Capacity must be greater than 0');
      }

      // Validate year
      const currentYear = new Date().getFullYear();
      if (data.year < 1900 || data.year > currentYear + 1) {
        throw new Error(`Year must be between 1900 and ${currentYear + 1}`);
      }

      const response = await api.bus.createBus(data);
      return {
        success: true,
        data: response.data,
        message: 'Bus created successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Update bus with validation
  async updateBus(id: string, data: Partial<Bus>) {
    try {
      // Validate capacity if provided
      if (data.capacity !== undefined && data.capacity <= 0) {
        throw new Error('Capacity must be greater than 0');
      }

      // Validate year if provided
      if (data.year !== undefined) {
        const currentYear = new Date().getFullYear();
        if (data.year < 1900 || data.year > currentYear + 1) {
          throw new Error(`Year must be between 1900 and ${currentYear + 1}`);
        }
      }

      const response = await api.bus.updateBus(id, data);
      return {
        success: true,
        data: response.data,
        message: 'Bus updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Delete bus with confirmation
  async deleteBus(id: string) {
    try {
      const response = await api.bus.deleteBus(id);
      return {
        success: true,
        data: null,
        message: 'Bus deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Update bus status
  async updateBusStatus(id: string, status: Bus['status']) {
    try {
      const response = await api.bus.updateBus(id, { status });
      return {
        success: true,
        data: response.data,
        message: `Bus status updated to ${status}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Assign driver to bus
  async assignDriverToBus(busId: string, driverId: string) {
    try {
      const response = await api.bus.updateBus(busId, { driverId });
      return {
        success: true,
        data: response.data,
        message: 'Driver assigned to bus successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Assign route to bus
  async assignRouteToBus(busId: string, routeId: string) {
    try {
      const response = await api.bus.updateBus(busId, { routeId });
      return {
        success: true,
        data: response.data,
        message: 'Route assigned to bus successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Get buses by status
  async getBusesByStatus(status: Bus['status'][]) {
    try {
      const response = await api.bus.getAllBuses({ 
        status: status.join(','),
        page: 1,
        limit: 100,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} buses with status: ${status.join(', ')}`,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 100, total: 0, totalPages: 0 },
        message: api.utils.handleError(error),
      };
    }
  }

  // Get buses by type
  async getBusesByType(busType: Bus['busType'][]) {
    try {
      const response = await api.bus.getAllBuses({ 
        busType: busType.join(','),
        page: 1,
        limit: 100,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} buses of type: ${busType.join(', ')}`,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 100, total: 0, totalPages: 0 },
        message: api.utils.handleError(error),
      };
    }
  }

  // Get buses needing maintenance
  async getBusesNeedingMaintenance() {
    try {
      const response = await api.bus.getAllBuses({ 
        status: 'maintenance',
        page: 1,
        limit: 100,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} buses needing maintenance`,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 100, total: 0, totalPages: 0 },
        message: api.utils.handleError(error),
      };
    }
  }

  // ============ ROUTE OPERATIONS ============

  // Get all routes with advanced filtering and pagination
  async getAllRoutes(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    isActive?: boolean;
    startLocation?: string;
    endLocation?: string;
  }) {
    try {
      const response = await api.bus.getAllRoutes(params);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        message: api.utils.handleError(error),
      };
    }
  }

  // Get single route by ID with related data
  async getRouteById(id: string) {
    try {
      const response = await api.bus.getRouteById(id);
      return {
        success: true,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Create new route with validation
  async createRoute(data: Omit<Route, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      // Validate required fields
      if (!data.name || !data.startLocation || !data.endLocation) {
        throw new Error('Missing required fields: name, startLocation, endLocation');
      }

      // Validate distance
      if (data.distance <= 0) {
        throw new Error('Distance must be greater than 0');
      }

      // Validate duration
      if (data.estimatedDuration <= 0) {
        throw new Error('Estimated duration must be greater than 0');
      }

      // Validate stops
      if (!data.stops || data.stops.length < 2) {
        throw new Error('Route must have at least 2 stops');
      }

      const response = await api.bus.createRoute(data);
      return {
        success: true,
        data: response.data,
        message: 'Route created successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Update route with validation
  async updateRoute(id: string, data: Partial<Route>) {
    try {
      // Validate distance if provided
      if (data.distance !== undefined && data.distance <= 0) {
        throw new Error('Distance must be greater than 0');
      }

      // Validate duration if provided
      if (data.estimatedDuration !== undefined && data.estimatedDuration <= 0) {
        throw new Error('Estimated duration must be greater than 0');
      }

      const response = await api.bus.updateRoute(id, data);
      return {
        success: true,
        data: response.data,
        message: 'Route updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Delete route with confirmation
  async deleteRoute(id: string) {
    try {
      const response = await api.bus.deleteRoute(id);
      return {
        success: true,
        data: null,
        message: 'Route deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Toggle route active status
  async toggleRouteStatus(id: string, isActive: boolean) {
    try {
      const response = await api.bus.updateRoute(id, { isActive });
      return {
        success: true,
        data: response.data,
        message: `Route ${isActive ? 'activated' : 'deactivated'} successfully`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // ============ DRIVER OPERATIONS ============

  // Get all drivers with advanced filtering and pagination
  async getAllDrivers(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string;
    experience?: number;
    rating?: number;
  }) {
    try {
      const response = await api.bus.getAllDrivers(params);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        message: api.utils.handleError(error),
      };
    }
  }

  // Get single driver by ID with related data
  async getDriverById(id: string) {
    try {
      const response = await api.bus.getDriverById(id);
      return {
        success: true,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Create new driver with validation
  async createDriver(data: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      // Validate required fields
      if (!data.name || !data.licenseNumber || !data.phone || !data.idNumber) {
        throw new Error('Missing required fields: name, licenseNumber, phone, idNumber');
      }

      // Validate phone number
      if (!this.isValidPhoneNumber(data.phone)) {
        throw new Error('Invalid phone number format');
      }

      // Validate email if provided
      if (data.email && !this.isValidEmail(data.email)) {
        throw new Error('Invalid email format');
      }

      // Validate experience
      if (data.experience < 0) {
        throw new Error('Experience cannot be negative');
      }

      // Validate rating
      if (data.rating < 1 || data.rating > 5) {
        throw new Error('Rating must be between 1 and 5');
      }

      // Validate salary
      if (data.salary < 0) {
        throw new Error('Salary cannot be negative');
      }

      const response = await api.bus.createDriver(data);
      return {
        success: true,
        data: response.data,
        message: 'Driver created successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Update driver with validation
  async updateDriver(id: string, data: Partial<Driver>) {
    try {
      // Validate phone number if provided
      if (data.phone && !this.isValidPhoneNumber(data.phone)) {
        throw new Error('Invalid phone number format');
      }

      // Validate email if provided
      if (data.email && !this.isValidEmail(data.email)) {
        throw new Error('Invalid email format');
      }

      // Validate experience if provided
      if (data.experience !== undefined && data.experience < 0) {
        throw new Error('Experience cannot be negative');
      }

      // Validate rating if provided
      if (data.rating !== undefined && (data.rating < 1 || data.rating > 5)) {
        throw new Error('Rating must be between 1 and 5');
      }

      // Validate salary if provided
      if (data.salary !== undefined && data.salary < 0) {
        throw new Error('Salary cannot be negative');
      }

      const response = await api.bus.updateDriver(id, data);
      return {
        success: true,
        data: response.data,
        message: 'Driver updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Delete driver with confirmation
  async deleteDriver(id: string) {
    try {
      const response = await api.bus.deleteDriver(id);
      return {
        success: true,
        data: null,
        message: 'Driver deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Update driver status
  async updateDriverStatus(id: string, status: Driver['status']) {
    try {
      const response = await api.bus.updateDriver(id, { status });
      return {
        success: true,
        data: response.data,
        message: `Driver status updated to ${status}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // ============ SCHEDULE OPERATIONS ============

  // Get all schedules with advanced filtering and pagination
  async getAllSchedules(params?: { 
    page?: number; 
    limit?: number; 
    busId?: string;
    routeId?: string;
    driverId?: string;
    status?: string;
    dayOfWeek?: number;
    recurrence?: string;
  }) {
    try {
      const response = await api.bus.getAllSchedules(params);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        message: api.utils.handleError(error),
      };
    }
  }

  // Get single schedule by ID with related data
  async getScheduleById(id: string) {
    try {
      const response = await api.bus.getScheduleById(id);
      return {
        success: true,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Create new schedule with validation
  async createSchedule(data: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      // Validate required fields
      if (!data.busId || !data.routeId || !data.driverId || !data.departureTime || !data.arrivalTime) {
        throw new Error('Missing required fields: busId, routeId, driverId, departureTime, arrivalTime');
      }

      // Validate time format
      if (!this.isValidTimeFormat(data.departureTime) || !this.isValidTimeFormat(data.arrivalTime)) {
        throw new Error('Invalid time format. Use HH:MM format');
      }

      // Validate day of week
      if (data.dayOfWeek < 0 || data.dayOfWeek > 6) {
        throw new Error('Day of week must be between 0 (Sunday) and 6 (Saturday)');
      }

      // Validate departure and arrival times
      if (data.departureTime >= data.arrivalTime) {
        throw new Error('Arrival time must be after departure time');
      }

      const response = await api.bus.createSchedule(data);
      return {
        success: true,
        data: response.data,
        message: 'Schedule created successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Update schedule with validation
  async updateSchedule(id: string, data: Partial<Schedule>) {
    try {
      // Validate time format if provided
      if (data.departureTime && !this.isValidTimeFormat(data.departureTime)) {
        throw new Error('Invalid departure time format. Use HH:MM format');
      }

      if (data.arrivalTime && !this.isValidTimeFormat(data.arrivalTime)) {
        throw new Error('Invalid arrival time format. Use HH:MM format');
      }

      // Validate day of week if provided
      if (data.dayOfWeek !== undefined && (data.dayOfWeek < 0 || data.dayOfWeek > 6)) {
        throw new Error('Day of week must be between 0 (Sunday) and 6 (Saturday)');
      }

      const response = await api.bus.updateSchedule(id, data);
      return {
        success: true,
        data: response.data,
        message: 'Schedule updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Delete schedule with confirmation
  async deleteSchedule(id: string) {
    try {
      const response = await api.bus.deleteSchedule(id);
      return {
        success: true,
        data: null,
        message: 'Schedule deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Update schedule status
  async updateScheduleStatus(id: string, status: Schedule['status']) {
    try {
      const response = await api.bus.updateSchedule(id, { status });
      return {
        success: true,
        data: response.data,
        message: `Schedule status updated to ${status}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // ============ ANALYTICS OPERATIONS ============

  // Get transport analytics
  async getTransportAnalytics() {
    try {
      const response = await api.bus.getAnalytics();
      return {
        success: true,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // ============ HELPER METHODS ============

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  private isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }
}

// Create singleton instance
export const busApiService = new BusApiService();

// Export convenience functions
export const busApi = {
  // Bus operations
  buses: {
    getAll: (params?: any) => busApiService.getAllBuses(params),
    getById: (id: string) => busApiService.getBusById(id),
    create: (data: any) => busApiService.createBus(data),
    update: (id: string, data: any) => busApiService.updateBus(id, data),
    delete: (id: string) => busApiService.deleteBus(id),
    updateStatus: (id: string, status: Bus['status']) => busApiService.updateBusStatus(id, status),
    assignDriver: (busId: string, driverId: string) => busApiService.assignDriverToBus(busId, driverId),
    assignRoute: (busId: string, routeId: string) => busApiService.assignRouteToBus(busId, routeId),
    getByStatus: (status: Bus['status'][]) => busApiService.getBusesByStatus(status),
    getByType: (busType: Bus['busType'][]) => busApiService.getBusesByType(busType),
    getNeedingMaintenance: () => busApiService.getBusesNeedingMaintenance(),
  },
  
  // Route operations
  routes: {
    getAll: (params?: any) => busApiService.getAllRoutes(params),
    getById: (id: string) => busApiService.getRouteById(id),
    create: (data: any) => busApiService.createRoute(data),
    update: (id: string, data: any) => busApiService.updateRoute(id, data),
    delete: (id: string) => busApiService.deleteRoute(id),
    toggleStatus: (id: string, isActive: boolean) => busApiService.toggleRouteStatus(id, isActive),
  },
  
  // Driver operations
  drivers: {
    getAll: (params?: any) => busApiService.getAllDrivers(params),
    getById: (id: string) => busApiService.getDriverById(id),
    create: (data: any) => busApiService.createDriver(data),
    update: (id: string, data: any) => busApiService.updateDriver(id, data),
    delete: (id: string) => busApiService.deleteDriver(id),
    updateStatus: (id: string, status: Driver['status']) => busApiService.updateDriverStatus(id, status),
  },
  
  // Schedule operations
  schedules: {
    getAll: (params?: any) => busApiService.getAllSchedules(params),
    getById: (id: string) => busApiService.getScheduleById(id),
    create: (data: any) => busApiService.createSchedule(data),
    update: (id: string, data: any) => busApiService.updateSchedule(id, data),
    delete: (id: string) => busApiService.deleteSchedule(id),
    updateStatus: (id: string, status: Schedule['status']) => busApiService.updateScheduleStatus(id, status),
  },
  
  // Analytics
  analytics: () => busApiService.getTransportAnalytics(),
};

export default busApi;

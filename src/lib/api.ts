// Centralized API service using BACKEND_URL environment variable
import { Event, EventCreateRequest, EventUpdateRequest, EventFilters, EventSearchParams } from '../types/event';
import { Operator, OperatorCreateRequest, OperatorUpdateRequest } from '../types/operator';
import { Supporter, SupporterCreateRequest, SupporterUpdateRequest } from '../types/supporter';
import { Bus, Route, Schedule, Driver, BusAnalytics } from './bus';
import { apiConfig, getHeaders, configUtils } from './config';
import { errorHandler, errorUtils } from './error-handling';

// API Configuration
const BACKEND_URL = apiConfig.baseUrl;

// Generic API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  success: boolean;
}

export class ApiError extends Error {
  public status: number;
  public errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

// HTTP Client class
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.defaultHeaders = getHeaders();
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    const context = {
      operation: `${options.method || 'GET'} ${endpoint}`,
      endpoint,
      method: options.method || 'GET',
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const apiError = new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.errors
        );
        throw errorHandler.handleError(apiError, context);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      const enhancedError = errorHandler.handleError(error, context);
      throw enhancedError;
    }
  }

  // Generic CRUD methods
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach(v => url.searchParams.append(key, v.toString()));
          } else {
            url.searchParams.append(key, value.toString());
          }
        }
      });
    }
    
    return this.request<T>(url.pathname + url.search);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Create API client instance
const apiClient = new ApiClient(BACKEND_URL);

// Events API
export const eventsApi = {
  // Get all events with filtering and pagination
  async getAll(params?: EventSearchParams): Promise<PaginatedResponse<Event>> {
    return apiClient.get<PaginatedResponse<Event>>('/api/events', params);
  },

  // Get single event by ID
  async getById(id: number): Promise<ApiResponse<Event>> {
    return apiClient.get<ApiResponse<Event>>(`/api/events/${id}`);
  },

  // Create new event
  async create(data: EventCreateRequest): Promise<ApiResponse<Event>> {
    return apiClient.post<ApiResponse<Event>>('/api/events', data);
  },

  // Update event
  async update(id: number, data: EventUpdateRequest): Promise<ApiResponse<Event>> {
    return apiClient.put<ApiResponse<Event>>(`/api/events/${id}`, data);
  },

  // Delete event
  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/api/events/${id}`);
  },

  // Get event statistics
  async getStats(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>('/api/events/stats');
  },

  // Export events
  async export(filters?: EventFilters): Promise<Blob> {
    const response = await fetch(`${BACKEND_URL}/events/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
    });
    return response.blob();
  },

  // Bulk operations
  async bulkDelete(ids: number[]): Promise<ApiResponse<void>> {
    return apiClient.post<ApiResponse<void>>('/events/bulk-delete', { ids });
  },

  async bulkUpdate(updates: { id: number; data: Partial<EventUpdateRequest> }[]): Promise<ApiResponse<Event[]>> {
    return apiClient.post<ApiResponse<Event[]>>('/events/bulk-update', { updates });
  },
};

// Operators API
export const operatorsApi = {
  // Get all operators with filtering and pagination
  async getAll(params?: { page?: number; limit?: number; search?: string; status?: string; role?: string; region_id?: number; district_id?: number }): Promise<PaginatedResponse<Operator>> {
    return apiClient.get<PaginatedResponse<Operator>>('/api/operators', params);
  },

  // Get single operator by ID
  async getById(id: number): Promise<ApiResponse<Operator>> {
    return apiClient.get<ApiResponse<Operator>>(`/api/operators/${id}`);
  },

  // Create new operator
  async create(data: OperatorCreateRequest): Promise<ApiResponse<Operator>> {
    return apiClient.post<ApiResponse<Operator>>('/api/operators', data);
  },

  // Update operator
  async update(id: number, data: OperatorUpdateRequest): Promise<ApiResponse<Operator>> {
    return apiClient.put<ApiResponse<Operator>>(`/api/operators/${id}`, data);
  },

  // Delete operator
  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/api/operators/${id}`);
  },

  // Approve operator
  async approve(id: number): Promise<ApiResponse<Operator>> {
    return apiClient.patch<ApiResponse<Operator>>(`/operators/${id}/approve`);
  },

  // Reject operator
  async reject(id: number, reason?: string): Promise<ApiResponse<Operator>> {
    return apiClient.patch<ApiResponse<Operator>>(`/operators/${id}/reject`, { reason });
  },

  // Get operator tasks
  async getTasks(id: number): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>(`/operators/${id}/tasks`);
  },

  // Get operator supporters
  async getSupporters(id: number): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>(`/operators/${id}/supporters`);
  },

  // Get operator analytics
  async getAnalytics(id: number): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>(`/operators/${id}/analytics`);
  },
};

// Supporters API
export const supportersApi = {
  // Get all supporters with filtering and pagination
  async getAll(params?: { page?: number; limit?: number; search?: string; status?: string; region_id?: number; district_id?: number; pollingstation_id?: number; fav_party?: string }): Promise<PaginatedResponse<Supporter>> {
    return apiClient.get<PaginatedResponse<Supporter>>('/api/supporters', params);
  },

  // Get single supporter by ID
  async getById(id: number): Promise<ApiResponse<Supporter>> {
    return apiClient.get<ApiResponse<Supporter>>(`/api/supporters/${id}`);
  },

  // Create new supporter
  async create(data: SupporterCreateRequest): Promise<ApiResponse<Supporter>> {
    return apiClient.post<ApiResponse<Supporter>>('/api/supporters', data);
  },

  // Update supporter
  async update(id: number, data: SupporterUpdateRequest): Promise<ApiResponse<Supporter>> {
    return apiClient.put<ApiResponse<Supporter>>(`/api/supporters/${id}`, data);
  },

  // Delete supporter
  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/api/supporters/${id}`);
  },

  // Approve supporter
  async approve(id: number): Promise<ApiResponse<Supporter>> {
    return apiClient.patch<ApiResponse<Supporter>>(`/supporters/${id}/approve`);
  },

  // Reject supporter
  async reject(id: number, reason?: string): Promise<ApiResponse<Supporter>> {
    return apiClient.patch<ApiResponse<Supporter>>(`/supporters/${id}/reject`, { reason });
  },

  // Get supporter statistics
  async getStats(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>('/supporters/stats');
  },

  // Export supporters
  async export(filters?: any): Promise<Blob> {
    const response = await fetch(`${BACKEND_URL}/supporters/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
    });
    return response.blob();
  },
};

// Bus/Transport API
export const busApi = {
  // Buses
  async getAllBuses(params?: { page?: number; limit?: number; search?: string; status?: string; busType?: string }): Promise<PaginatedResponse<Bus>> {
    return apiClient.get<PaginatedResponse<Bus>>('/api/buses', params);
  },

  async getBusById(id: string): Promise<ApiResponse<Bus>> {
    return apiClient.get<ApiResponse<Bus>>(`/api/buses/${id}`);
  },

  async createBus(data: Omit<Bus, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Bus>> {
    return apiClient.post<ApiResponse<Bus>>('/api/buses', data);
  },

  async updateBus(id: string, data: Partial<Bus>): Promise<ApiResponse<Bus>> {
    return apiClient.put<ApiResponse<Bus>>(`/api/buses/${id}`, data);
  },

  async deleteBus(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/api/buses/${id}`);
  },

  // Routes
  async getAllRoutes(params?: { page?: number; limit?: number; search?: string; isActive?: boolean }): Promise<PaginatedResponse<Route>> {
    return apiClient.get<PaginatedResponse<Route>>('/routes', params);
  },

  async getRouteById(id: string): Promise<ApiResponse<Route>> {
    return apiClient.get<ApiResponse<Route>>(`/routes/${id}`);
  },

  async createRoute(data: Omit<Route, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Route>> {
    return apiClient.post<ApiResponse<Route>>('/routes', data);
  },

  async updateRoute(id: string, data: Partial<Route>): Promise<ApiResponse<Route>> {
    return apiClient.put<ApiResponse<Route>>(`/routes/${id}`, data);
  },

  async deleteRoute(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/routes/${id}`);
  },

  // Drivers
  async getAllDrivers(params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<PaginatedResponse<Driver>> {
    return apiClient.get<PaginatedResponse<Driver>>('/drivers', params);
  },

  async getDriverById(id: string): Promise<ApiResponse<Driver>> {
    return apiClient.get<ApiResponse<Driver>>(`/drivers/${id}`);
  },

  async createDriver(data: Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Driver>> {
    return apiClient.post<ApiResponse<Driver>>('/drivers', data);
  },

  async updateDriver(id: string, data: Partial<Driver>): Promise<ApiResponse<Driver>> {
    return apiClient.put<ApiResponse<Driver>>(`/drivers/${id}`, data);
  },

  async deleteDriver(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/drivers/${id}`);
  },

  // Schedules
  async getAllSchedules(params?: { page?: number; limit?: number; busId?: string; routeId?: string; driverId?: string; status?: string }): Promise<PaginatedResponse<Schedule>> {
    return apiClient.get<PaginatedResponse<Schedule>>('/schedules', params);
  },

  async getScheduleById(id: string): Promise<ApiResponse<Schedule>> {
    return apiClient.get<ApiResponse<Schedule>>(`/schedules/${id}`);
  },

  async createSchedule(data: Omit<Schedule, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Schedule>> {
    return apiClient.post<ApiResponse<Schedule>>('/schedules', data);
  },

  async updateSchedule(id: string, data: Partial<Schedule>): Promise<ApiResponse<Schedule>> {
    return apiClient.put<ApiResponse<Schedule>>(`/schedules/${id}`, data);
  },

  async deleteSchedule(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/schedules/${id}`);
  },

  // Analytics
  async getAnalytics(): Promise<ApiResponse<BusAnalytics>> {
    return apiClient.get<ApiResponse<BusAnalytics>>('/transport/analytics');
  },
};

// Funds API
export const fundsApi = {
  // Get all funds with filtering and pagination
  async getAll(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    category?: string; 
    source?: string; 
    status?: string;
    operator_id?: number;
    event_id?: number;
    date_from?: string; 
    date_to?: string;
    amount_min?: number;
    amount_max?: number;
    payment_method?: string;
  }): Promise<PaginatedResponse<any>> {
    return apiClient.get<PaginatedResponse<any>>('/api/funds', params);
  },

  // Get single fund by ID
  async getById(id: number): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>(`/api/funds/${id}`);
  },

  // Create new fund
  async create(data: any): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>('/api/funds', data);
  },

  // Update fund
  async update(id: number, data: any): Promise<ApiResponse<any>> {
    return apiClient.put<ApiResponse<any>>(`/api/funds/${id}`, data);
  },

  // Delete fund
  async delete(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/api/funds/${id}`);
  },

  // Get fund statistics
  async getStats(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>('/funds/stats');
  },

  // Export funds
  async export(filters?: any): Promise<Blob> {
    const response = await fetch(`${BACKEND_URL}/funds/export`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters),
    });
    return response.blob();
  },
};

// Communication API
export const communicationApi = {
  // Get all messages with filtering and pagination
  async getAllMessages(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    messageType?: string; 
    status?: string; 
    priority?: string; 
    language?: string; 
    recipient_type?: string; 
    created_by?: number; 
    date_from?: string; 
    date_to?: string; 
  }): Promise<PaginatedResponse<any>> {
    return apiClient.get<PaginatedResponse<any>>('/communication/messages', params);
  },

  // Get single message by ID
  async getMessageById(id: number): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>(`/communication/messages/${id}`);
  },

  // Send message
  async sendMessage(data: any): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>('/communication/send', data);
  },

  // Update message
  async updateMessage(id: number, data: any): Promise<ApiResponse<any>> {
    return apiClient.put<ApiResponse<any>>(`/communication/messages/${id}`, data);
  },

  // Delete message
  async deleteMessage(id: number): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/communication/messages/${id}`);
  },

  // Get communication statistics
  async getStats(): Promise<ApiResponse<any>> {
    return apiClient.get<ApiResponse<any>>('/communication/stats');
  },

  // Get recipient groups
  async getRecipientGroups(): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>('/communication/groups');
  },

  // Create recipient group
  async createRecipientGroup(data: any): Promise<ApiResponse<any>> {
    return apiClient.post<ApiResponse<any>>('/communication/groups', data);
  },
};

// Regions and Districts API
export const locationApi = {
  // Get all regions
  async getRegions(): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>('/locations/regions');
  },

  // Get districts by region
  async getDistrictsByRegion(regionId: number): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>(`/locations/regions/${regionId}/districts`);
  },

  // Get all districts
  async getAllDistricts(): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>('/locations/districts');
  },

  // Get polling stations by district
  async getPollingStationsByDistrict(districtId: number): Promise<ApiResponse<any[]>> {
    return apiClient.get<ApiResponse<any[]>>(`/locations/districts/${districtId}/polling-stations`);
  },
};

// Utility functions
export const apiUtils = {
  // Retry function with exponential backoff
  async retry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error | undefined;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }
    
    throw lastError || new Error('Retry failed');
  },

  // Handle API errors
  handleError(error: unknown): string {
    if (error instanceof ApiError) {
      return error.message;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },

  // Check if error is network related
  isNetworkError(error: unknown): boolean {
    if (error instanceof ApiError) {
      return error.status === 0 || error.status >= 500;
    }
    return error instanceof TypeError && (error as Error).message.includes('fetch');
  },

  // Format API response for display
  formatResponse<T>(response: ApiResponse<T>): { data: T; message?: string } {
    return {
      data: response.data,
      message: response.message,
    };
  },
};

// Export all APIs
export const api = {
  events: eventsApi,
  operators: operatorsApi,
  supporters: supportersApi,
  bus: busApi,
  funds: fundsApi,
  communication: communicationApi,
  location: locationApi,
  utils: apiUtils,
};

export default api;

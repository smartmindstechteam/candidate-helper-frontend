// Events API implementation with comprehensive CRUD operations
import { api } from './api';
import { Event, EventCreateRequest, EventUpdateRequest, EventFilters, EventSearchParams, EventStats } from '../types/event';

export class EventsApiService {
  // Get all events with advanced filtering and pagination
  async getAllEvents(params?: EventSearchParams) {
    try {
      const response = await api.events.getAll(params);
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

  // Get single event by ID with related data
  async getEventById(id: number) {
    try {
      const response = await api.events.getById(id);
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

  // Create new event with validation
  async createEvent(data: EventCreateRequest) {
    try {
      // Validate required fields
      if (!data.title || !data.type || !data.start_time || !data.end_time) {
        throw new Error('Missing required fields: title, type, start_time, end_time');
      }

      // Validate date range
      const startDate = new Date(data.start_time);
      const endDate = new Date(data.end_time);
      if (startDate >= endDate) {
        throw new Error('End time must be after start time');
      }

      const response = await api.events.create(data);
      return {
        success: true,
        data: response.data,
        message: 'Event created successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Update event with validation
  async updateEvent(id: number, data: EventUpdateRequest) {
    try {
      // Validate date range if both dates are provided
      if (data.start_time && data.end_time) {
        const startDate = new Date(data.start_time);
        const endDate = new Date(data.end_time);
        if (startDate >= endDate) {
          throw new Error('End time must be after start time');
        }
      }

      const response = await api.events.update(id, data);
      return {
        success: true,
        data: response.data,
        message: 'Event updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Delete event with confirmation
  async deleteEvent(id: number) {
    try {
      const response = await api.events.delete(id);
      return {
        success: true,
        data: null,
        message: 'Event deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Get event statistics
  async getEventStats() {
    try {
      const response = await api.events.getStats();
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

  // Export events to CSV/Excel
  async exportEvents(filters?: EventFilters) {
    try {
      const blob = await api.events.export(filters);
      return {
        success: true,
        data: blob,
        message: 'Events exported successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Bulk operations
  async bulkDeleteEvents(ids: number[]) {
    try {
      if (!ids || ids.length === 0) {
        throw new Error('No events selected for deletion');
      }

      const response = await api.events.bulkDelete(ids);
      return {
        success: true,
        data: response.data,
        message: `${ids.length} events deleted successfully`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  async bulkUpdateEvents(updates: { id: number; data: Partial<EventUpdateRequest> }[]) {
    try {
      if (!updates || updates.length === 0) {
        throw new Error('No events selected for update');
      }

      const response = await api.events.bulkUpdate(updates);
      return {
        success: true,
        data: response.data,
        message: `${updates.length} events updated successfully`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Event status management
  async updateEventStatus(id: number, status: Event['status']) {
    try {
      const response = await api.events.update(id, { id, status });
      return {
        success: true,
        data: response.data,
        message: `Event status updated to ${status}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Event attendance management
  async updateAttendance(id: number, actualAttendance: number) {
    try {
      const response = await api.events.update(id, { id, actual_attendance: actualAttendance });
      return {
        success: true,
        data: response.data,
        message: 'Attendance updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Search events with advanced filters
  async searchEvents(query: string, filters?: EventFilters) {
    try {
      const searchParams: EventSearchParams = {
        filters: {
          ...filters,
          search: query,
        },
        page: 1,
        limit: 50,
      };

      const response = await api.events.getAll(searchParams);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} events`,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0 },
        message: api.utils.handleError(error),
      };
    }
  }

  // Get events by date range
  async getEventsByDateRange(startDate: string, endDate: string) {
    try {
      const filters: EventFilters = {
        date_from: startDate,
        date_to: endDate,
      };

      const response = await api.events.getAll({ filters });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} events in date range`,
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

  // Get events by region/district
  async getEventsByLocation(regionId?: number, districtId?: number) {
    try {
      const filters: EventFilters = {
        region_id: regionId ? [regionId] : undefined,
        district_id: districtId ? [districtId] : undefined,
      };

      const response = await api.events.getAll({ filters });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} events in location`,
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

  // Get upcoming events
  async getUpcomingEvents(limit: number = 10) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const filters: EventFilters = {
        date_from: today,
        status: ['planned', 'scheduled'],
      };

      const response = await api.events.getAll({ 
        filters,
        limit,
        sort_by: 'start_time',
        sort_order: 'asc',
      });

      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} upcoming events`,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit, total: 0, totalPages: 0 },
        message: api.utils.handleError(error),
      };
    }
  }

  // Get events by status
  async getEventsByStatus(status: Event['status'][]) {
    try {
      const filters: EventFilters = {
        status,
      };

      const response = await api.events.getAll({ filters });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} events with status: ${status.join(', ')}`,
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

  // Get events by type
  async getEventsByType(type: Event['type'][]) {
    try {
      const filters: EventFilters = {
        type,
      };

      const response = await api.events.getAll({ filters });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} events of type: ${type.join(', ')}`,
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

  // Duplicate event
  async duplicateEvent(id: number, newTitle?: string) {
    try {
      // First get the original event
      const originalResponse = await this.getEventById(id);
      if (!originalResponse.success || !originalResponse.data) {
        throw new Error('Event not found');
      }

      const originalEvent = originalResponse.data;
      
      // Create new event data with modified title and reset status
      const duplicateData: EventCreateRequest = {
        title: newTitle || `${originalEvent.title} (Copy)`,
        type: originalEvent.type,
        category: originalEvent.category,
        timezone: originalEvent.timezone,
        description: originalEvent.description,
        objective: originalEvent.objective,
        tags: originalEvent.tags,
        priority: originalEvent.priority,
        start_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 2 hours later
        recurrence: originalEvent.recurrence,
        recurrence_rule: originalEvent.recurrence_rule,
        setup_time: originalEvent.setup_time,
        teardown_time: originalEvent.teardown_time,
        venue: originalEvent.venue,
        city: originalEvent.city,
        district_id: originalEvent.district_id,
        region_id: originalEvent.region_id,
        address: originalEvent.address,
        lat: originalEvent.lat,
        lng: originalEvent.lng,
        max_capacity: originalEvent.max_capacity,
        expected_attendance: originalEvent.expected_attendance,
        budget_amount: originalEvent.budget_amount,
        estimated_cost: originalEvent.estimated_cost,
        funding_source_id: originalEvent.funding_source_id,
        status: 'planned',
        media_links: originalEvent.media_links,
        organizer_name: originalEvent.organizer_name,
        organizer_contact: originalEvent.organizer_contact,
        backup_contact: originalEvent.backup_contact,
        assigned_operator_id: originalEvent.assigned_operator_id,
        risk_assessment: originalEvent.risk_assessment,
        contingency_plan: originalEvent.contingency_plan,
        feedback_link: originalEvent.feedback_link,
      };

      const response = await this.createEvent(duplicateData);
      return {
        success: response.success,
        data: response.data,
        message: response.success ? 'Event duplicated successfully' : response.message,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }
}

// Create singleton instance
export const eventsApiService = new EventsApiService();

// Export convenience functions
export const eventsApi = {
  getAll: (params?: EventSearchParams) => eventsApiService.getAllEvents(params),
  getById: (id: number) => eventsApiService.getEventById(id),
  create: (data: EventCreateRequest) => eventsApiService.createEvent(data),
  update: (id: number, data: EventUpdateRequest) => eventsApiService.updateEvent(id, data),
  delete: (id: number) => eventsApiService.deleteEvent(id),
  getStats: () => eventsApiService.getEventStats(),
  export: (filters?: EventFilters) => eventsApiService.exportEvents(filters),
  bulkDelete: (ids: number[]) => eventsApiService.bulkDeleteEvents(ids),
  bulkUpdate: (updates: { id: number; data: Partial<EventUpdateRequest> }[]) => eventsApiService.bulkUpdateEvents(updates),
  updateStatus: (id: number, status: Event['status']) => eventsApiService.updateEventStatus(id, status),
  updateAttendance: (id: number, actualAttendance: number) => eventsApiService.updateAttendance(id, actualAttendance),
  search: (query: string, filters?: EventFilters) => eventsApiService.searchEvents(query, filters),
  getByDateRange: (startDate: string, endDate: string) => eventsApiService.getEventsByDateRange(startDate, endDate),
  getByLocation: (regionId?: number, districtId?: number) => eventsApiService.getEventsByLocation(regionId, districtId),
  getUpcoming: (limit?: number) => eventsApiService.getUpcomingEvents(limit),
  getByStatus: (status: Event['status'][]) => eventsApiService.getEventsByStatus(status),
  getByType: (type: Event['type'][]) => eventsApiService.getEventsByType(type),
  duplicate: (id: number, newTitle?: string) => eventsApiService.duplicateEvent(id, newTitle),
};

export default eventsApi;

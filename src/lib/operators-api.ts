// Operators API implementation with comprehensive CRUD operations
import { api } from './api';
import { Operator, OperatorCreateRequest, OperatorUpdateRequest } from '../types/operator';

export class OperatorsApiService {
  // Get all operators with advanced filtering and pagination
  async getAllOperators(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    role?: string;
    region_id?: number;
    district_id?: number;
  }) {
    try {
      const response = await api.operators.getAll(params);
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

  // Get single operator by ID with related data
  async getOperatorById(id: number) {
    try {
      const response = await api.operators.getById(id);
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

  // Create new operator with validation
  async createOperator(data: OperatorCreateRequest) {
    try {
      // Validate required fields
      if (!data.firstname || !data.lastname || !data.role) {
        throw new Error('Missing required fields: firstname, lastname, role');
      }

      // Validate email format if provided
      if (data.email && !this.isValidEmail(data.email)) {
        throw new Error('Invalid email format');
      }

      // Validate phone numbers
      if (data.phones && data.phones.length > 0) {
        for (const phone of data.phones) {
          if (!this.isValidPhoneNumber(phone.phone_number)) {
            throw new Error(`Invalid phone number: ${phone.phone_number}`);
          }
        }
      }

      const response = await api.operators.create(data);
      return {
        success: true,
        data: response.data,
        message: 'Operator created successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Update operator with validation
  async updateOperator(id: number, data: OperatorUpdateRequest) {
    try {
      // Validate email format if provided
      if (data.email && !this.isValidEmail(data.email)) {
        throw new Error('Invalid email format');
      }

      // Validate phone numbers if provided
      if (data.phones && data.phones.length > 0) {
        for (const phone of data.phones) {
          if (!this.isValidPhoneNumber(phone.phone_number)) {
            throw new Error(`Invalid phone number: ${phone.phone_number}`);
          }
        }
      }

      const response = await api.operators.update(id, data);
      return {
        success: true,
        data: response.data,
        message: 'Operator updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Delete operator with confirmation
  async deleteOperator(id: number) {
    try {
      const response = await api.operators.delete(id);
      return {
        success: true,
        data: null,
        message: 'Operator deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Approve operator
  async approveOperator(id: number) {
    try {
      const response = await api.operators.approve(id);
      return {
        success: true,
        data: response.data,
        message: 'Operator approved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Reject operator
  async rejectOperator(id: number, reason?: string) {
    try {
      const response = await api.operators.reject(id, reason);
      return {
        success: true,
        data: response.data,
        message: 'Operator rejected successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Get operator tasks
  async getOperatorTasks(id: number) {
    try {
      const response = await api.operators.getTasks(id);
      return {
        success: true,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: api.utils.handleError(error),
      };
    }
  }

  // Get operator supporters
  async getOperatorSupporters(id: number) {
    try {
      const response = await api.operators.getSupporters(id);
      return {
        success: true,
        data: response.data,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        message: api.utils.handleError(error),
      };
    }
  }

  // Get operator analytics
  async getOperatorAnalytics(id: number) {
    try {
      const response = await api.operators.getAnalytics(id);
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

  // Search operators with advanced filters
  async searchOperators(query: string, filters?: {
    status?: string;
    role?: string;
    region_id?: number;
    district_id?: number;
  }) {
    try {
      const searchParams = {
        search: query,
        ...filters,
        page: 1,
        limit: 50,
      };

      const response = await api.operators.getAll(searchParams);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} operators`,
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

  // Get operators by status
  async getOperatorsByStatus(status: Operator['status'][]) {
    try {
      const response = await api.operators.getAll({ 
        status: status.join(','),
        page: 1,
        limit: 100,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} operators with status: ${status.join(', ')}`,
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

  // Get operators by role
  async getOperatorsByRole(role: Operator['role'][]) {
    try {
      const response = await api.operators.getAll({ 
        role: role.join(','),
        page: 1,
        limit: 100,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} operators with role: ${role.join(', ')}`,
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

  // Get operators by location
  async getOperatorsByLocation(regionId?: number, districtId?: number) {
    try {
      const response = await api.operators.getAll({ 
        region_id: regionId,
        district_id: districtId,
        page: 1,
        limit: 100,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} operators in location`,
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

  // Get pending operators
  async getPendingOperators() {
    try {
      const response = await this.getOperatorsByStatus(['pending']);
      return response;
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 100, total: 0, totalPages: 0 },
        message: api.utils.handleError(error),
      };
    }
  }

  // Get approved operators
  async getApprovedOperators() {
    try {
      const response = await this.getOperatorsByStatus(['approved']);
      return response;
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 100, total: 0, totalPages: 0 },
        message: api.utils.handleError(error),
      };
    }
  }

  // Get rejected operators
  async getRejectedOperators() {
    try {
      const response = await this.getOperatorsByStatus(['rejected']);
      return response;
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 100, total: 0, totalPages: 0 },
        message: api.utils.handleError(error),
      };
    }
  }

  // Update operator status
  async updateOperatorStatus(id: number, status: Operator['status']) {
    try {
      const response = await api.operators.update(id, { id, status });
      return {
        success: true,
        data: response.data,
        message: `Operator status updated to ${status}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Update operator role
  async updateOperatorRole(id: number, role: Operator['role']) {
    try {
      const response = await api.operators.update(id, { id, role });
      return {
        success: true,
        data: response.data,
        message: `Operator role updated to ${role}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Bulk approve operators
  async bulkApproveOperators(ids: number[]) {
    try {
      if (!ids || ids.length === 0) {
        throw new Error('No operators selected for approval');
      }

      const results = await Promise.allSettled(
        ids.map(id => this.approveOperator(id))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return {
        success: successful > 0,
        data: null,
        message: `${successful} operators approved successfully${failed > 0 ? `, ${failed} failed` : ''}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Bulk reject operators
  async bulkRejectOperators(ids: number[], reason?: string) {
    try {
      if (!ids || ids.length === 0) {
        throw new Error('No operators selected for rejection');
      }

      const results = await Promise.allSettled(
        ids.map(id => this.rejectOperator(id, reason))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return {
        success: successful > 0,
        data: null,
        message: `${successful} operators rejected successfully${failed > 0 ? `, ${failed} failed` : ''}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Bulk delete operators
  async bulkDeleteOperators(ids: number[]) {
    try {
      if (!ids || ids.length === 0) {
        throw new Error('No operators selected for deletion');
      }

      const results = await Promise.allSettled(
        ids.map(id => this.deleteOperator(id))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return {
        success: successful > 0,
        data: null,
        message: `${successful} operators deleted successfully${failed > 0 ? `, ${failed} failed` : ''}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Export operators
  async exportOperators(filters?: {
    status?: string;
    role?: string;
    region_id?: number;
    district_id?: number;
  }) {
    try {
      const response = await api.operators.getAll({ 
        ...filters,
        page: 1,
        limit: 10000, // Large limit for export
      });

      // Convert to CSV format
      const csvData = this.convertToCSV(response.data);
      const blob = new Blob([csvData], { type: 'text/csv' });

      return {
        success: true,
        data: blob,
        message: 'Operators exported successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Helper methods
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private isValidPhoneNumber(phone: string): boolean {
    // Basic phone number validation - can be enhanced based on requirements
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  private convertToCSV(data: Operator[]): string {
    if (!data || data.length === 0) return '';

    const headers = [
      'ID',
      'First Name',
      'Middle Name',
      'Last Name',
      'Fourth Name',
      'Email',
      'Phone',
      'Role',
      'Status',
      'Created At',
      'Updated At'
    ];

    const rows = data.map(operator => [
      operator.id,
      operator.firstname,
      operator.middlename || '',
      operator.lastname,
      operator.fourthname || '',
      operator.email || '',
      operator.phones?.[0]?.phone_number || '',
      operator.role,
      operator.status,
      operator.created_at,
      operator.updated_at
    ]);

    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  }
}

// Create singleton instance
export const operatorsApiService = new OperatorsApiService();

// Export convenience functions
export const operatorsApi = {
  getAll: (params?: any) => operatorsApiService.getAllOperators(params),
  getById: (id: number) => operatorsApiService.getOperatorById(id),
  create: (data: OperatorCreateRequest) => operatorsApiService.createOperator(data),
  update: (id: number, data: OperatorUpdateRequest) => operatorsApiService.updateOperator(id, data),
  delete: (id: number) => operatorsApiService.deleteOperator(id),
  approve: (id: number) => operatorsApiService.approveOperator(id),
  reject: (id: number, reason?: string) => operatorsApiService.rejectOperator(id, reason),
  getTasks: (id: number) => operatorsApiService.getOperatorTasks(id),
  getSupporters: (id: number) => operatorsApiService.getOperatorSupporters(id),
  getAnalytics: (id: number) => operatorsApiService.getOperatorAnalytics(id),
  search: (query: string, filters?: any) => operatorsApiService.searchOperators(query, filters),
  getByStatus: (status: Operator['status'][]) => operatorsApiService.getOperatorsByStatus(status),
  getByRole: (role: Operator['role'][]) => operatorsApiService.getOperatorsByRole(role),
  getByLocation: (regionId?: number, districtId?: number) => operatorsApiService.getOperatorsByLocation(regionId, districtId),
  getPending: () => operatorsApiService.getPendingOperators(),
  getApproved: () => operatorsApiService.getApprovedOperators(),
  getRejected: () => operatorsApiService.getRejectedOperators(),
  updateStatus: (id: number, status: Operator['status']) => operatorsApiService.updateOperatorStatus(id, status),
  updateRole: (id: number, role: Operator['role']) => operatorsApiService.updateOperatorRole(id, role),
  bulkApprove: (ids: number[]) => operatorsApiService.bulkApproveOperators(ids),
  bulkReject: (ids: number[], reason?: string) => operatorsApiService.bulkRejectOperators(ids, reason),
  bulkDelete: (ids: number[]) => operatorsApiService.bulkDeleteOperators(ids),
  export: (filters?: any) => operatorsApiService.exportOperators(filters),
};

export default operatorsApi;

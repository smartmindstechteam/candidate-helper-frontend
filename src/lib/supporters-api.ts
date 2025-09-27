// Supporters API implementation with comprehensive CRUD operations
import { api } from './api';
import { Supporter, SupporterCreateRequest, SupporterUpdateRequest } from '../types/supporter';

export class SupportersApiService {
  // Get all supporters with advanced filtering and pagination
  async getAllSupporters(params?: { 
    page?: number; 
    limit?: number; 
    search?: string; 
    status?: string; 
    region_id?: number;
    district_id?: number;
    pollingstation_id?: number;
    fav_party?: string;
  }) {
    try {
      const response = await api.supporters.getAll(params);
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

  // Get single supporter by ID with related data
  async getSupporterById(id: number) {
    try {
      const response = await api.supporters.getById(id);
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

  // Create new supporter with validation
  async createSupporter(data: SupporterCreateRequest) {
    try {
      // Validate required fields
      if (!data.firstname || !data.lastname) {
        throw new Error('Missing required fields: firstname, lastname');
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

      // Validate voter ID format if provided
      if (data.voter_id && !this.isValidVoterId(data.voter_id)) {
        throw new Error('Invalid voter ID format');
      }

      const response = await api.supporters.create(data);
      return {
        success: true,
        data: response.data,
        message: 'Supporter created successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Update supporter with validation
  async updateSupporter(id: number, data: SupporterUpdateRequest) {
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

      // Validate voter ID format if provided
      if (data.voter_id && !this.isValidVoterId(data.voter_id)) {
        throw new Error('Invalid voter ID format');
      }

      const response = await api.supporters.update(id, data);
      return {
        success: true,
        data: response.data,
        message: 'Supporter updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Delete supporter with confirmation
  async deleteSupporter(id: number) {
    try {
      const response = await api.supporters.delete(id);
      return {
        success: true,
        data: null,
        message: 'Supporter deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Approve supporter
  async approveSupporter(id: number) {
    try {
      const response = await api.supporters.approve(id);
      return {
        success: true,
        data: response.data,
        message: 'Supporter approved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Reject supporter
  async rejectSupporter(id: number, reason?: string) {
    try {
      const response = await api.supporters.reject(id, reason);
      return {
        success: true,
        data: response.data,
        message: 'Supporter rejected successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Get supporter statistics
  async getSupporterStats() {
    try {
      const response = await api.supporters.getStats();
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

  // Search supporters with advanced filters
  async searchSupporters(query: string, filters?: {
    status?: string;
    region_id?: number;
    district_id?: number;
    pollingstation_id?: number;
    fav_party?: string;
  }) {
    try {
      const searchParams = {
        search: query,
        ...filters,
        page: 1,
        limit: 50,
      };

      const response = await api.supporters.getAll(searchParams);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} supporters`,
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

  // Get supporters by status
  async getSupportersByStatus(status: Supporter['status'][]) {
    try {
      const response = await api.supporters.getAll({ 
        status: status.join(','),
        page: 1,
        limit: 100,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} supporters with status: ${status.join(', ')}`,
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

  // Get supporters by region
  async getSupportersByRegion(regionId: number) {
    try {
      const response = await api.supporters.getAll({ 
        region_id: regionId,
        page: 1,
        limit: 1000,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} supporters in region`,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 1000, total: 0, totalPages: 0 },
        message: api.utils.handleError(error),
      };
    }
  }

  // Get supporters by district
  async getSupportersByDistrict(districtId: number) {
    try {
      const response = await api.supporters.getAll({ 
        district_id: districtId,
        page: 1,
        limit: 1000,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} supporters in district`,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 1000, total: 0, totalPages: 0 },
        message: api.utils.handleError(error),
      };
    }
  }

  // Get supporters by polling station
  async getSupportersByPollingStation(pollingStationId: number) {
    try {
      const response = await api.supporters.getAll({ 
        pollingstation_id: pollingStationId,
        page: 1,
        limit: 1000,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} supporters at polling station`,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 1000, total: 0, totalPages: 0 },
        message: api.utils.handleError(error),
      };
    }
  }

  // Get supporters by political party
  async getSupportersByParty(party: string) {
    try {
      const response = await api.supporters.getAll({ 
        fav_party: party,
        page: 1,
        limit: 1000,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} supporters for party: ${party}`,
      };
    } catch (error) {
      return {
        success: false,
        data: [],
        pagination: { page: 1, limit: 1000, total: 0, totalPages: 0 },
        message: api.utils.handleError(error),
      };
    }
  }

  // Get pending supporters
  async getPendingSupporters() {
    try {
      const response = await this.getSupportersByStatus(['pending']);
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

  // Get approved supporters
  async getApprovedSupporters() {
    try {
      const response = await this.getSupportersByStatus(['approved']);
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

  // Get rejected supporters
  async getRejectedSupporters() {
    try {
      const response = await this.getSupportersByStatus(['rejected']);
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

  // Update supporter status
  async updateSupporterStatus(id: number, status: Supporter['status']) {
    try {
      const response = await api.supporters.update(id, { id, status });
      return {
        success: true,
        data: response.data,
        message: `Supporter status updated to ${status}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Update supporter polling station
  async updateSupporterPollingStation(id: number, pollingStationId: number) {
    try {
      const response = await api.supporters.update(id, { id, pollingstation_id: pollingStationId });
      return {
        success: true,
        data: response.data,
        message: 'Supporter polling station updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Update supporter political party
  async updateSupporterParty(id: number, party: string) {
    try {
      const response = await api.supporters.update(id, { id, fav_party: party });
      return {
        success: true,
        data: response.data,
        message: `Supporter political party updated to ${party}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Bulk approve supporters
  async bulkApproveSupporters(ids: number[]) {
    try {
      if (!ids || ids.length === 0) {
        throw new Error('No supporters selected for approval');
      }

      const results = await Promise.allSettled(
        ids.map(id => this.approveSupporter(id))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return {
        success: successful > 0,
        data: null,
        message: `${successful} supporters approved successfully${failed > 0 ? `, ${failed} failed` : ''}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Bulk reject supporters
  async bulkRejectSupporters(ids: number[], reason?: string) {
    try {
      if (!ids || ids.length === 0) {
        throw new Error('No supporters selected for rejection');
      }

      const results = await Promise.allSettled(
        ids.map(id => this.rejectSupporter(id, reason))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return {
        success: successful > 0,
        data: null,
        message: `${successful} supporters rejected successfully${failed > 0 ? `, ${failed} failed` : ''}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Bulk delete supporters
  async bulkDeleteSupporters(ids: number[]) {
    try {
      if (!ids || ids.length === 0) {
        throw new Error('No supporters selected for deletion');
      }

      const results = await Promise.allSettled(
        ids.map(id => this.deleteSupporter(id))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return {
        success: successful > 0,
        data: null,
        message: `${successful} supporters deleted successfully${failed > 0 ? `, ${failed} failed` : ''}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Export supporters
  async exportSupporters(filters?: {
    status?: string;
    region_id?: number;
    district_id?: number;
    pollingstation_id?: number;
    fav_party?: string;
  }) {
    try {
      const response = await api.supporters.getAll({ 
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
        message: 'Supporters exported successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Get supporter demographics
  async getSupporterDemographics() {
    try {
      const statsResponse = await this.getSupporterStats();
      if (!statsResponse.success) {
        throw new Error(statsResponse.message);
      }

      // Process demographics data
      const demographics = {
        total: statsResponse.data?.total_supporters || 0,
        byStatus: statsResponse.data?.by_status || {},
        byGender: statsResponse.data?.by_gender || {},
        byAgeGroup: statsResponse.data?.by_age_group || {},
        byRegion: statsResponse.data?.by_region || {},
        byDistrict: statsResponse.data?.by_district || {},
        byParty: statsResponse.data?.by_party || {},
        byPollingStation: statsResponse.data?.by_polling_station || {},
      };

      return {
        success: true,
        data: demographics,
        message: 'Demographics retrieved successfully',
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

  private isValidVoterId(voterId: string): boolean {
    // Basic voter ID validation - can be enhanced based on requirements
    const voterIdRegex = /^[A-Z0-9]{6,12}$/;
    return voterIdRegex.test(voterId);
  }

  private convertToCSV(data: Supporter[]): string {
    if (!data || data.length === 0) return '';

    const headers = [
      'ID',
      'First Name',
      'Middle Name',
      'Last Name',
      'Fourth Name',
      'Email',
      'Phone',
      'Voter ID',
      'Status',
      'Region',
      'District',
      'Polling Station',
      'Political Party',
      'Created At',
      'Updated At'
    ];

    const rows = data.map(supporter => [
      supporter.id,
      supporter.firstname,
      supporter.middlename || '',
      supporter.lastname,
      supporter.fourthname || '',
      supporter.email || '',
      supporter.phones?.[0]?.phone_number || '',
      supporter.voter_id || '',
      supporter.status,
      supporter.region?.name || '',
      supporter.district?.name || '',
      supporter.pollingstation?.name || '',
      supporter.fav_party || '',
      supporter.created_at,
      supporter.updated_at
    ]);

    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  }
}

// Create singleton instance
export const supportersApiService = new SupportersApiService();

// Export convenience functions
export const supportersApi = {
  getAll: (params?: any) => supportersApiService.getAllSupporters(params),
  getById: (id: number) => supportersApiService.getSupporterById(id),
  create: (data: SupporterCreateRequest) => supportersApiService.createSupporter(data),
  update: (id: number, data: SupporterUpdateRequest) => supportersApiService.updateSupporter(id, data),
  delete: (id: number) => supportersApiService.deleteSupporter(id),
  approve: (id: number) => supportersApiService.approveSupporter(id),
  reject: (id: number, reason?: string) => supportersApiService.rejectSupporter(id, reason),
  getStats: () => supportersApiService.getSupporterStats(),
  search: (query: string, filters?: any) => supportersApiService.searchSupporters(query, filters),
  getByStatus: (status: Supporter['status'][]) => supportersApiService.getSupportersByStatus(status),
  getByRegion: (regionId: number) => supportersApiService.getSupportersByRegion(regionId),
  getByDistrict: (districtId: number) => supportersApiService.getSupportersByDistrict(districtId),
  getByPollingStation: (pollingStationId: number) => supportersApiService.getSupportersByPollingStation(pollingStationId),
  getByParty: (party: string) => supportersApiService.getSupportersByParty(party),
  getPending: () => supportersApiService.getPendingSupporters(),
  getApproved: () => supportersApiService.getApprovedSupporters(),
  getRejected: () => supportersApiService.getRejectedSupporters(),
  updateStatus: (id: number, status: Supporter['status']) => supportersApiService.updateSupporterStatus(id, status),
  updatePollingStation: (id: number, pollingStationId: number) => supportersApiService.updateSupporterPollingStation(id, pollingStationId),
  updateParty: (id: number, party: string) => supportersApiService.updateSupporterParty(id, party),
  bulkApprove: (ids: number[]) => supportersApiService.bulkApproveSupporters(ids),
  bulkReject: (ids: number[], reason?: string) => supportersApiService.bulkRejectSupporters(ids, reason),
  bulkDelete: (ids: number[]) => supportersApiService.bulkDeleteSupporters(ids),
  export: (filters?: any) => supportersApiService.exportSupporters(filters),
  getDemographics: () => supportersApiService.getSupporterDemographics(),
};

export default supportersApi;

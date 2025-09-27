// Funds API implementation with comprehensive CRUD operations
import { api } from './api';

export interface Fund {
  id: number;
  title: string;
  amount: number;
  category: string;
  source: string;
  description?: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  operator_id?: number;
  event_id?: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  payment_method?: string;
  reference_number?: string;
  notes?: string;
}

export interface FundCreateRequest {
  title: string;
  amount: number;
  category: string;
  source: string;
  description?: string;
  transaction_date: string;
  operator_id?: number;
  event_id?: number;
  payment_method?: string;
  reference_number?: string;
  notes?: string;
}

export interface FundUpdateRequest extends Partial<FundCreateRequest> {
  id: number;
  status?: 'pending' | 'approved' | 'rejected' | 'completed';
}

export interface FundFilters {
  category?: string[];
  source?: string[];
  status?: string[];
  operator_id?: number[];
  event_id?: number[];
  date_from?: string;
  date_to?: string;
  amount_min?: number;
  amount_max?: number;
  payment_method?: string[];
}

export interface FundStats {
  total_funds: number;
  total_amount: number;
  pending_amount: number;
  approved_amount: number;
  rejected_amount: number;
  completed_amount: number;
  by_category: Record<string, { count: number; amount: number }>;
  by_source: Record<string, { count: number; amount: number }>;
  by_status: Record<string, { count: number; amount: number }>;
  by_month: Record<string, { count: number; amount: number }>;
  by_operator: Record<string, { count: number; amount: number }>;
  by_event: Record<string, { count: number; amount: number }>;
}

export class FundsApiService {
  // Get all funds with advanced filtering and pagination
  async getAllFunds(params?: { 
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
  }) {
    try {
      const response = await api.funds.getAll(params);
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

  // Get single fund by ID with related data
  async getFundById(id: number) {
    try {
      const response = await api.funds.getById(id);
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

  // Create new fund with validation
  async createFund(data: FundCreateRequest) {
    try {
      // Validate required fields
      if (!data.title || !data.amount || !data.category || !data.source || !data.transaction_date) {
        throw new Error('Missing required fields: title, amount, category, source, transaction_date');
      }

      // Validate amount
      if (data.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // Validate transaction date
      const transactionDate = new Date(data.transaction_date);
      const today = new Date();
      if (transactionDate > today) {
        throw new Error('Transaction date cannot be in the future');
      }

      // Validate reference number format if provided
      if (data.reference_number && !this.isValidReferenceNumber(data.reference_number)) {
        throw new Error('Invalid reference number format');
      }

      const response = await api.funds.create(data);
      return {
        success: true,
        data: response.data,
        message: 'Fund created successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Update fund with validation
  async updateFund(id: number, data: FundUpdateRequest) {
    try {
      // Validate amount if provided
      if (data.amount !== undefined && data.amount <= 0) {
        throw new Error('Amount must be greater than 0');
      }

      // Validate transaction date if provided
      if (data.transaction_date) {
        const transactionDate = new Date(data.transaction_date);
        const today = new Date();
        if (transactionDate > today) {
          throw new Error('Transaction date cannot be in the future');
        }
      }

      // Validate reference number format if provided
      if (data.reference_number && !this.isValidReferenceNumber(data.reference_number)) {
        throw new Error('Invalid reference number format');
      }

      const response = await api.funds.update(id, data);
      return {
        success: true,
        data: response.data,
        message: 'Fund updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Delete fund with confirmation
  async deleteFund(id: number) {
    try {
      const response = await api.funds.delete(id);
      return {
        success: true,
        data: null,
        message: 'Fund deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Get fund statistics
  async getFundStats() {
    try {
      const response = await api.funds.getStats();
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

  // Search funds with advanced filters
  async searchFunds(query: string, filters?: FundFilters) {
    try {
      const searchParams = {
        search: query,
        category: filters?.category?.join(','),
        source: filters?.source?.join(','),
        status: filters?.status?.join(','),
        operator_id: filters?.operator_id?.[0],
        event_id: filters?.event_id?.[0],
        date_from: filters?.date_from,
        date_to: filters?.date_to,
        amount_min: filters?.amount_min,
        amount_max: filters?.amount_max,
        payment_method: filters?.payment_method?.join(','),
        page: 1,
        limit: 50,
      };

      const response = await api.funds.getAll(searchParams);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} funds`,
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

  // Get funds by status
  async getFundsByStatus(status: Fund['status'][]) {
    try {
      const response = await api.funds.getAll({ 
        status: status.join(','),
        page: 1,
        limit: 100,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} funds with status: ${status.join(', ')}`,
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

  // Get funds by category
  async getFundsByCategory(category: string[]) {
    try {
      const response = await api.funds.getAll({ 
        category: category.join(','),
        page: 1,
        limit: 100,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} funds in categories: ${category.join(', ')}`,
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

  // Get funds by source
  async getFundsBySource(source: string[]) {
    try {
      const response = await api.funds.getAll({ 
        source: source.join(','),
        page: 1,
        limit: 100,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} funds from sources: ${source.join(', ')}`,
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

  // Get funds by operator
  async getFundsByOperator(operatorId: number) {
    try {
      const response = await api.funds.getAll({ 
        operator_id: operatorId,
        page: 1,
        limit: 100,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} funds for operator`,
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

  // Get funds by event
  async getFundsByEvent(eventId: number) {
    try {
      const response = await api.funds.getAll({ 
        event_id: eventId,
        page: 1,
        limit: 100,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} funds for event`,
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

  // Get funds by date range
  async getFundsByDateRange(startDate: string, endDate: string) {
    try {
      const response = await api.funds.getAll({ 
        date_from: startDate,
        date_to: endDate,
        page: 1,
        limit: 1000,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} funds in date range`,
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

  // Get funds by amount range
  async getFundsByAmountRange(minAmount: number, maxAmount: number) {
    try {
      const response = await api.funds.getAll({ 
        amount_min: minAmount,
        amount_max: maxAmount,
        page: 1,
        limit: 100,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} funds in amount range`,
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

  // Get pending funds
  async getPendingFunds() {
    try {
      const response = await this.getFundsByStatus(['pending']);
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

  // Get approved funds
  async getApprovedFunds() {
    try {
      const response = await this.getFundsByStatus(['approved']);
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

  // Get rejected funds
  async getRejectedFunds() {
    try {
      const response = await this.getFundsByStatus(['rejected']);
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

  // Get completed funds
  async getCompletedFunds() {
    try {
      const response = await this.getFundsByStatus(['completed']);
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

  // Update fund status
  async updateFundStatus(id: number, status: Fund['status']) {
    try {
      const response = await api.funds.update(id, { id, status });
      return {
        success: true,
        data: response.data,
        message: `Fund status updated to ${status}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Approve fund
  async approveFund(id: number) {
    try {
      const response = await this.updateFundStatus(id, 'approved');
      return response;
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Reject fund
  async rejectFund(id: number, reason?: string) {
    try {
      const updateData: FundUpdateRequest = {
        id,
        status: 'rejected',
        notes: reason ? `Rejected: ${reason}` : 'Rejected',
      };
      const response = await this.updateFund(id, updateData);
      return response;
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Complete fund
  async completeFund(id: number) {
    try {
      const response = await this.updateFundStatus(id, 'completed');
      return response;
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Bulk approve funds
  async bulkApproveFunds(ids: number[]) {
    try {
      if (!ids || ids.length === 0) {
        throw new Error('No funds selected for approval');
      }

      const results = await Promise.allSettled(
        ids.map(id => this.approveFund(id))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return {
        success: successful > 0,
        data: null,
        message: `${successful} funds approved successfully${failed > 0 ? `, ${failed} failed` : ''}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Bulk reject funds
  async bulkRejectFunds(ids: number[], reason?: string) {
    try {
      if (!ids || ids.length === 0) {
        throw new Error('No funds selected for rejection');
      }

      const results = await Promise.allSettled(
        ids.map(id => this.rejectFund(id, reason))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return {
        success: successful > 0,
        data: null,
        message: `${successful} funds rejected successfully${failed > 0 ? `, ${failed} failed` : ''}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Bulk delete funds
  async bulkDeleteFunds(ids: number[]) {
    try {
      if (!ids || ids.length === 0) {
        throw new Error('No funds selected for deletion');
      }

      const results = await Promise.allSettled(
        ids.map(id => this.deleteFund(id))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return {
        success: successful > 0,
        data: null,
        message: `${successful} funds deleted successfully${failed > 0 ? `, ${failed} failed` : ''}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Export funds
  async exportFunds(filters?: FundFilters) {
    try {
      const response = await api.funds.getAll({ 
        category: filters?.category?.join(','),
        source: filters?.source?.join(','),
        status: filters?.status?.join(','),
        operator_id: filters?.operator_id?.[0],
        event_id: filters?.event_id?.[0],
        date_from: filters?.date_from,
        date_to: filters?.date_to,
        amount_min: filters?.amount_min,
        amount_max: filters?.amount_max,
        payment_method: filters?.payment_method?.join(','),
        page: 1,
        limit: 10000, // Large limit for export
      });

      // Convert to CSV format
      const csvData = this.convertToCSV(response.data);
      const blob = new Blob([csvData], { type: 'text/csv' });

      return {
        success: true,
        data: blob,
        message: 'Funds exported successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Get fund summary
  async getFundSummary() {
    try {
      const statsResponse = await this.getFundStats();
      if (!statsResponse.success) {
        throw new Error(statsResponse.message);
      }

      const stats = statsResponse.data;
      const summary = {
        totalFunds: stats.total_funds || 0,
        totalAmount: stats.total_amount || 0,
        pendingAmount: stats.pending_amount || 0,
        approvedAmount: stats.approved_amount || 0,
        rejectedAmount: stats.rejected_amount || 0,
        completedAmount: stats.completed_amount || 0,
        averageAmount: stats.total_funds > 0 ? (stats.total_amount / stats.total_funds) : 0,
        topCategories: Object.entries(stats.by_category || {})
          .sort(([,a], [,b]) => (b as { count: number; amount: number }).amount - (a as { count: number; amount: number }).amount)
          .slice(0, 5),
        topSources: Object.entries(stats.by_source || {})
          .sort(([,a], [,b]) => (b as { count: number; amount: number }).amount - (a as { count: number; amount: number }).amount)
          .slice(0, 5),
        monthlyTrend: stats.by_month || {},
      };

      return {
        success: true,
        data: summary,
        message: 'Fund summary retrieved successfully',
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
  private isValidReferenceNumber(refNumber: string): boolean {
    // Basic reference number validation - can be enhanced based on requirements
    const refRegex = /^[A-Z0-9\-]{6,20}$/;
    return refRegex.test(refNumber);
  }

  private convertToCSV(data: Fund[]): string {
    if (!data || data.length === 0) return '';

    const headers = [
      'ID',
      'Title',
      'Amount',
      'Category',
      'Source',
      'Description',
      'Transaction Date',
      'Status',
      'Payment Method',
      'Reference Number',
      'Notes',
      'Created At',
      'Updated At'
    ];

    const rows = data.map(fund => [
      fund.id,
      fund.title,
      fund.amount,
      fund.category,
      fund.source,
      fund.description || '',
      fund.transaction_date,
      fund.status,
      fund.payment_method || '',
      fund.reference_number || '',
      fund.notes || '',
      fund.created_at,
      fund.updated_at
    ]);

    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  }
}

// Create singleton instance
export const fundsApiService = new FundsApiService();

// Export convenience functions
export const fundsApi = {
  getAll: (params?: any) => fundsApiService.getAllFunds(params),
  getById: (id: number) => fundsApiService.getFundById(id),
  create: (data: FundCreateRequest) => fundsApiService.createFund(data),
  update: (id: number, data: FundUpdateRequest) => fundsApiService.updateFund(id, data),
  delete: (id: number) => fundsApiService.deleteFund(id),
  getStats: () => fundsApiService.getFundStats(),
  search: (query: string, filters?: FundFilters) => fundsApiService.searchFunds(query, filters),
  getByStatus: (status: Fund['status'][]) => fundsApiService.getFundsByStatus(status),
  getByCategory: (category: string[]) => fundsApiService.getFundsByCategory(category),
  getBySource: (source: string[]) => fundsApiService.getFundsBySource(source),
  getByOperator: (operatorId: number) => fundsApiService.getFundsByOperator(operatorId),
  getByEvent: (eventId: number) => fundsApiService.getFundsByEvent(eventId),
  getByDateRange: (startDate: string, endDate: string) => fundsApiService.getFundsByDateRange(startDate, endDate),
  getByAmountRange: (minAmount: number, maxAmount: number) => fundsApiService.getFundsByAmountRange(minAmount, maxAmount),
  getPending: () => fundsApiService.getPendingFunds(),
  getApproved: () => fundsApiService.getApprovedFunds(),
  getRejected: () => fundsApiService.getRejectedFunds(),
  getCompleted: () => fundsApiService.getCompletedFunds(),
  updateStatus: (id: number, status: Fund['status']) => fundsApiService.updateFundStatus(id, status),
  approve: (id: number) => fundsApiService.approveFund(id),
  reject: (id: number, reason?: string) => fundsApiService.rejectFund(id, reason),
  complete: (id: number) => fundsApiService.completeFund(id),
  bulkApprove: (ids: number[]) => fundsApiService.bulkApproveFunds(ids),
  bulkReject: (ids: number[], reason?: string) => fundsApiService.bulkRejectFunds(ids, reason),
  bulkDelete: (ids: number[]) => fundsApiService.bulkDeleteFunds(ids),
  export: (filters?: FundFilters) => fundsApiService.exportFunds(filters),
  getSummary: () => fundsApiService.getFundSummary(),
};

export default fundsApi;

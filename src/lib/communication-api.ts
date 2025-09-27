// Communication API implementation with comprehensive CRUD operations
import { api } from './api';

export interface Message {
  id: number;
  title: string;
  content: string;
  message_type: 'sms' | 'email' | 'push' | 'whatsapp' | 'voice_call';
  recipient_type: 'all' | 'operators' | 'supporters' | 'specific' | 'group';
  recipient_ids?: number[];
  recipient_groups?: string[];
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  language: 'somali' | 'english' | 'arabic';
  scheduled_at?: string;
  sent_at?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  
  // Tracking and analytics
  track_opens?: boolean;
  track_clicks?: boolean;
  track_responses?: boolean;
  open_count?: number;
  click_count?: number;
  response_count?: number;
  
  // Message settings
  allow_unsubscribe?: boolean;
  include_signature?: boolean;
  requires_confirmation?: boolean;
  attachment_urls?: string[];
  
  // Delivery settings
  retry_count?: number;
  max_retries?: number;
  delivery_attempts?: number;
  last_delivery_attempt?: string;
  
  // Error handling
  error_message?: string;
  error_code?: string;
}

export interface MessageCreateRequest {
  title: string;
  content: string;
  message_type: 'sms' | 'email' | 'push' | 'whatsapp' | 'voice_call';
  recipient_type: 'all' | 'operators' | 'supporters' | 'specific' | 'group';
  recipient_ids?: number[];
  recipient_groups?: string[];
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  language?: 'somali' | 'english' | 'arabic';
  scheduled_at?: string;
  track_opens?: boolean;
  track_clicks?: boolean;
  track_responses?: boolean;
  allow_unsubscribe?: boolean;
  include_signature?: boolean;
  requires_confirmation?: boolean;
  attachment_urls?: string[];
  max_retries?: number;
}

export interface MessageUpdateRequest extends Partial<MessageCreateRequest> {
  id: number;
}

export interface RecipientGroup {
  id: string;
  name: string;
  description?: string;
  recipient_type: 'operators' | 'supporters' | 'mixed';
  recipient_ids: number[];
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface CommunicationStats {
  total_messages: number;
  sent_messages: number;
  failed_messages: number;
  scheduled_messages: number;
  draft_messages: number;
  by_type: Record<string, number>;
  by_status: Record<string, number>;
  by_priority: Record<string, number>;
  by_language: Record<string, number>;
  by_month: Record<string, number>;
  total_recipients: number;
  total_opens: number;
  total_clicks: number;
  total_responses: number;
  open_rate: number;
  click_rate: number;
  response_rate: number;
}

export class CommunicationApiService {
  // ============ MESSAGE OPERATIONS ============

  // Get all messages with advanced filtering and pagination
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
  }) {
    try {
      const response = await api.communication.getAllMessages(params);
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

  // Get single message by ID with related data
  async getMessageById(id: number) {
    try {
      const response = await api.communication.getMessageById(id);
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

  // Send message with validation
  async sendMessage(data: MessageCreateRequest) {
    try {
      // Validate required fields
      if (!data.title || !data.content || !data.message_type || !data.recipient_type) {
        throw new Error('Missing required fields: title, content, message_type, recipient_type');
      }

      // Validate content length based on message type
      if (data.message_type === 'sms' && data.content.length > 160) {
        throw new Error('SMS content cannot exceed 160 characters');
      }

      // Validate recipient data
      if (data.recipient_type === 'specific' && (!data.recipient_ids || data.recipient_ids.length === 0)) {
        throw new Error('Recipient IDs are required for specific recipient type');
      }

      if (data.recipient_type === 'group' && (!data.recipient_groups || data.recipient_groups.length === 0)) {
        throw new Error('Recipient groups are required for group recipient type');
      }

      // Validate scheduled time if provided
      if (data.scheduled_at) {
        const scheduledTime = new Date(data.scheduled_at);
        const now = new Date();
        if (scheduledTime <= now) {
          throw new Error('Scheduled time must be in the future');
        }
      }

      const response = await api.communication.sendMessage(data);
      return {
        success: true,
        data: response.data,
        message: 'Message sent successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Update message with validation
  async updateMessage(id: number, data: MessageUpdateRequest) {
    try {
      // Validate content length if provided
      if (data.content && data.message_type === 'sms' && data.content.length > 160) {
        throw new Error('SMS content cannot exceed 160 characters');
      }

      // Validate scheduled time if provided
      if (data.scheduled_at) {
        const scheduledTime = new Date(data.scheduled_at);
        const now = new Date();
        if (scheduledTime <= now) {
          throw new Error('Scheduled time must be in the future');
        }
      }

      const response = await api.communication.updateMessage(id, data);
      return {
        success: true,
        data: response.data,
        message: 'Message updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Delete message with confirmation
  async deleteMessage(id: number) {
    try {
      const response = await api.communication.deleteMessage(id);
      return {
        success: true,
        data: null,
        message: 'Message deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Get communication statistics
  async getCommunicationStats() {
    try {
      const response = await api.communication.getStats();
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

  // ============ MESSAGE FILTERING AND SEARCH ============

  // Search messages with advanced filters
  async searchMessages(query: string, filters?: {
    message_type?: string;
    status?: string;
    priority?: string;
    language?: string;
    recipient_type?: string;
    created_by?: number;
    date_from?: string;
    date_to?: string;
  }) {
    try {
      const searchParams = {
        search: query,
        ...filters,
        page: 1,
        limit: 50,
      };

      const response = await api.communication.getAllMessages(searchParams);
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} messages`,
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

  // Get messages by status
  async getMessagesByStatus(status: Message['status'][]) {
    try {
      const response = await api.communication.getAllMessages({ 
        status: status.join(','),
        page: 1,
        limit: 100,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} messages with status: ${status.join(', ')}`,
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

  // Get messages by type
  async getMessagesByType(messageType: Message['message_type'][]) {
    try {
      const response = await api.communication.getAllMessages({ 
        messageType: messageType.join(','),
        page: 1,
        limit: 100,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} messages of type: ${messageType.join(', ')}`,
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

  // Get messages by priority
  async getMessagesByPriority(priority: Message['priority'][]) {
    try {
      const response = await api.communication.getAllMessages({ 
        priority: priority.join(','),
        page: 1,
        limit: 100,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} messages with priority: ${priority.join(', ')}`,
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

  // Get messages by language
  async getMessagesByLanguage(language: Message['language'][]) {
    try {
      const response = await api.communication.getAllMessages({ 
        language: language.join(','),
        page: 1,
        limit: 100,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} messages in language: ${language.join(', ')}`,
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

  // Get messages by date range
  async getMessagesByDateRange(startDate: string, endDate: string) {
    try {
      const response = await api.communication.getAllMessages({ 
        date_from: startDate,
        date_to: endDate,
        page: 1,
        limit: 1000,
      });
      return {
        success: true,
        data: response.data,
        pagination: response.pagination,
        message: `Found ${response.data.length} messages in date range`,
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

  // Get draft messages
  async getDraftMessages() {
    try {
      const response = await this.getMessagesByStatus(['draft']);
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

  // Get scheduled messages
  async getScheduledMessages() {
    try {
      const response = await this.getMessagesByStatus(['scheduled']);
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

  // Get sent messages
  async getSentMessages() {
    try {
      const response = await this.getMessagesByStatus(['sent']);
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

  // Get failed messages
  async getFailedMessages() {
    try {
      const response = await this.getMessagesByStatus(['failed']);
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

  // ============ MESSAGE STATUS MANAGEMENT ============

  // Update message status
  async updateMessageStatus(id: number, status: Message['status']) {
    try {
      const response = await api.communication.updateMessage(id, { status });
      return {
        success: true,
        data: response.data,
        message: `Message status updated to ${status}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Cancel message
  async cancelMessage(id: number) {
    try {
      const response = await this.updateMessageStatus(id, 'cancelled');
      return response;
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Retry failed message
  async retryMessage(id: number) {
    try {
      const response = await this.updateMessageStatus(id, 'sending');
      return response;
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // ============ RECIPIENT GROUP OPERATIONS ============

  // Get all recipient groups
  async getRecipientGroups() {
    try {
      const response = await api.communication.getRecipientGroups();
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

  // Create recipient group
  async createRecipientGroup(data: Omit<RecipientGroup, 'id' | 'created_at' | 'updated_at'>) {
    try {
      // Validate required fields
      if (!data.name || !data.recipient_type || !data.recipient_ids || data.recipient_ids.length === 0) {
        throw new Error('Missing required fields: name, recipient_type, recipient_ids');
      }

      const response = await api.communication.createRecipientGroup(data);
      return {
        success: true,
        data: response.data,
        message: 'Recipient group created successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // ============ BULK OPERATIONS ============

  // Bulk send messages
  async bulkSendMessages(messages: MessageCreateRequest[]) {
    try {
      if (!messages || messages.length === 0) {
        throw new Error('No messages provided for bulk sending');
      }

      const results = await Promise.allSettled(
        messages.map(message => this.sendMessage(message))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return {
        success: successful > 0,
        data: null,
        message: `${successful} messages sent successfully${failed > 0 ? `, ${failed} failed` : ''}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Bulk delete messages
  async bulkDeleteMessages(ids: number[]) {
    try {
      if (!ids || ids.length === 0) {
        throw new Error('No messages selected for deletion');
      }

      const results = await Promise.allSettled(
        ids.map(id => this.deleteMessage(id))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return {
        success: successful > 0,
        data: null,
        message: `${successful} messages deleted successfully${failed > 0 ? `, ${failed} failed` : ''}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Bulk cancel messages
  async bulkCancelMessages(ids: number[]) {
    try {
      if (!ids || ids.length === 0) {
        throw new Error('No messages selected for cancellation');
      }

      const results = await Promise.allSettled(
        ids.map(id => this.cancelMessage(id))
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return {
        success: successful > 0,
        data: null,
        message: `${successful} messages cancelled successfully${failed > 0 ? `, ${failed} failed` : ''}`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // ============ ANALYTICS AND REPORTING ============

  // Get message analytics
  async getMessageAnalytics() {
    try {
      const statsResponse = await this.getCommunicationStats();
      if (!statsResponse.success) {
        throw new Error(statsResponse.message);
      }

      const stats = statsResponse.data;
      const analytics = {
        totalMessages: stats.total_messages || 0,
        sentMessages: stats.sent_messages || 0,
        failedMessages: stats.failed_messages || 0,
        scheduledMessages: stats.scheduled_messages || 0,
        draftMessages: stats.draft_messages || 0,
        totalRecipients: stats.total_recipients || 0,
        totalOpens: stats.total_opens || 0,
        totalClicks: stats.total_clicks || 0,
        totalResponses: stats.total_responses || 0,
        openRate: stats.open_rate || 0,
        clickRate: stats.click_rate || 0,
        responseRate: stats.response_rate || 0,
        byType: stats.by_type || {},
        byStatus: stats.by_status || {},
        byPriority: stats.by_priority || {},
        byLanguage: stats.by_language || {},
        byMonth: stats.by_month || {},
      };

      return {
        success: true,
        data: analytics,
        message: 'Message analytics retrieved successfully',
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: api.utils.handleError(error),
      };
    }
  }

  // Export messages
  async exportMessages(filters?: {
    message_type?: string;
    status?: string;
    priority?: string;
    language?: string;
    recipient_type?: string;
    created_by?: number;
    date_from?: string;
    date_to?: string;
  }) {
    try {
      const response = await api.communication.getAllMessages({ 
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
        message: 'Messages exported successfully',
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

  private convertToCSV(data: Message[]): string {
    if (!data || data.length === 0) return '';

    const headers = [
      'ID',
      'Title',
      'Content',
      'Message Type',
      'Recipient Type',
      'Status',
      'Priority',
      'Language',
      'Scheduled At',
      'Sent At',
      'Open Count',
      'Click Count',
      'Response Count',
      'Created At',
      'Updated At'
    ];

    const rows = data.map(message => [
      message.id,
      message.title,
      message.content,
      message.message_type,
      message.recipient_type,
      message.status,
      message.priority,
      message.language,
      message.scheduled_at || '',
      message.sent_at || '',
      message.open_count || 0,
      message.click_count || 0,
      message.response_count || 0,
      message.created_at,
      message.updated_at
    ]);

    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  }
}

// Create singleton instance
export const communicationApiService = new CommunicationApiService();

// Export convenience functions
export const communicationApi = {
  // Message operations
  messages: {
    getAll: (params?: any) => communicationApiService.getAllMessages(params),
    getById: (id: number) => communicationApiService.getMessageById(id),
    send: (data: MessageCreateRequest) => communicationApiService.sendMessage(data),
    update: (id: number, data: MessageUpdateRequest) => communicationApiService.updateMessage(id, data),
    delete: (id: number) => communicationApiService.deleteMessage(id),
    updateStatus: (id: number, status: Message['status']) => communicationApiService.updateMessageStatus(id, status),
    cancel: (id: number) => communicationApiService.cancelMessage(id),
    retry: (id: number) => communicationApiService.retryMessage(id),
    search: (query: string, filters?: any) => communicationApiService.searchMessages(query, filters),
    getByStatus: (status: Message['status'][]) => communicationApiService.getMessagesByStatus(status),
    getByType: (messageType: Message['message_type'][]) => communicationApiService.getMessagesByType(messageType),
    getByPriority: (priority: Message['priority'][]) => communicationApiService.getMessagesByPriority(priority),
    getByLanguage: (language: Message['language'][]) => communicationApiService.getMessagesByLanguage(language),
    getByDateRange: (startDate: string, endDate: string) => communicationApiService.getMessagesByDateRange(startDate, endDate),
    getDrafts: () => communicationApiService.getDraftMessages(),
    getScheduled: () => communicationApiService.getScheduledMessages(),
    getSent: () => communicationApiService.getSentMessages(),
    getFailed: () => communicationApiService.getFailedMessages(),
    bulkSend: (messages: MessageCreateRequest[]) => communicationApiService.bulkSendMessages(messages),
    bulkDelete: (ids: number[]) => communicationApiService.bulkDeleteMessages(ids),
    bulkCancel: (ids: number[]) => communicationApiService.bulkCancelMessages(ids),
    export: (filters?: any) => communicationApiService.exportMessages(filters),
  },
  
  // Recipient group operations
  groups: {
    getAll: () => communicationApiService.getRecipientGroups(),
    create: (data: any) => communicationApiService.createRecipientGroup(data),
  },
  
  // Analytics
  getStats: () => communicationApiService.getCommunicationStats(),
  getAnalytics: () => communicationApiService.getMessageAnalytics(),
};

export default communicationApi;

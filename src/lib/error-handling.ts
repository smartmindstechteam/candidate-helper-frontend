// Comprehensive error handling and retry logic for API operations
import { ApiError } from './api';

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryCondition?: (error: any) => boolean;
}

export interface ErrorContext {
  operation: string;
  endpoint: string;
  method: string;
  timestamp: string;
  userId?: string;
  requestId?: string;
  retryCount?: number;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: Array<{ error: any; context: ErrorContext; timestamp: string }> = [];
  private maxLogSize = 1000;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // Default retry configuration
  private defaultRetryConfig: RetryConfig = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    retryCondition: (error) => this.isRetryableError(error),
  };

  // Check if an error is retryable
  private isRetryableError(error: any): boolean {
    if (error instanceof ApiError) {
      // Retry on network errors and 5xx server errors
      return error.status === 0 || (error.status >= 500 && error.status < 600);
    }
    
    // Retry on network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return true;
    }
    
    // Don't retry on client errors (4xx)
    if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
      return false;
    }
    
    return false;
  }

  // Calculate delay for retry with exponential backoff
  private calculateDelay(retryCount: number, config: RetryConfig): number {
    const delay = config.baseDelay * Math.pow(config.backoffMultiplier, retryCount);
    return Math.min(delay, config.maxDelay);
  }

  // Retry function with exponential backoff
  async retry<T>(
    operation: () => Promise<T>,
    context: ErrorContext,
    config: Partial<RetryConfig> = {}
  ): Promise<T> {
    const retryConfig = { ...this.defaultRetryConfig, ...config };
    let lastError: any;

    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        const result = await operation();
        
        // Log successful retry if it wasn't the first attempt
        if (attempt > 0) {
          this.logError({
            error: { message: 'Retry successful', attempt },
            context: { ...context, retryCount: attempt },
            timestamp: new Date().toISOString(),
          });
        }
        
        return result;
      } catch (error) {
        lastError = error;
        
        // Log the error
        this.logError({
          error,
          context: { ...context, retryCount: attempt },
          timestamp: new Date().toISOString(),
        });

        // Check if we should retry
        if (attempt < retryConfig.maxRetries && retryConfig.retryCondition!(error)) {
          const delay = this.calculateDelay(attempt, retryConfig);
          
          // Log retry attempt
          console.warn(`Retrying ${context.operation} in ${delay}ms (attempt ${attempt + 1}/${retryConfig.maxRetries})`);
          
          await this.sleep(delay);
        } else {
          break;
        }
      }
    }

    // All retries failed, throw the last error
    throw this.enhanceError(lastError, context);
  }

  // Enhanced error with additional context
  private enhanceError(error: any, context: ErrorContext): Error {
    if (error instanceof ApiError) {
      return new ApiError(
        `${context.operation} failed: ${error.message}`,
        error.status,
        error.errors
      );
    }

    const enhancedError = new Error(`${context.operation} failed: ${error.message}`);
    (enhancedError as any).context = context;
    (enhancedError as any).timestamp = new Date().toISOString();
    (enhancedError as any).originalError = error;
    
    return enhancedError;
  }

  // Log error for debugging and monitoring
  private logError(logEntry: { error: any; context: ErrorContext; timestamp: string }) {
    this.errorLog.push(logEntry);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', logEntry);
    }
  }

  // Get error logs for debugging
  getErrorLogs(): Array<{ error: any; context: ErrorContext; timestamp: string }> {
    return [...this.errorLog];
  }

  // Clear error logs
  clearErrorLogs(): void {
    this.errorLog = [];
  }

  // Get error statistics
  getErrorStats(): {
    totalErrors: number;
    errorsByOperation: Record<string, number>;
    errorsByStatus: Record<string, number>;
    recentErrors: Array<{ error: any; context: ErrorContext; timestamp: string }>;
  } {
    const totalErrors = this.errorLog.length;
    const errorsByOperation: Record<string, number> = {};
    const errorsByStatus: Record<string, number> = {};
    
    this.errorLog.forEach(logEntry => {
      const operation = logEntry.context.operation;
      errorsByOperation[operation] = (errorsByOperation[operation] || 0) + 1;
      
      if (logEntry.error.status) {
        const status = logEntry.error.status.toString();
        errorsByStatus[status] = (errorsByStatus[status] || 0) + 1;
      }
    });

    const recentErrors = this.errorLog.slice(-10); // Last 10 errors

    return {
      totalErrors,
      errorsByOperation,
      errorsByStatus,
      recentErrors,
    };
  }

  // Handle specific error types
  handleNetworkError(error: any, context: ErrorContext): Error {
    const networkError = new Error(`Network error during ${context.operation}: ${error.message}`);
    (networkError as any).type = 'NETWORK_ERROR';
    (networkError as any).context = context;
    (networkError as any).timestamp = new Date().toISOString();
    return networkError;
  }

  handleTimeoutError(error: any, context: ErrorContext): Error {
    const timeoutError = new Error(`Request timeout during ${context.operation}: ${error.message}`);
    (timeoutError as any).type = 'TIMEOUT_ERROR';
    (timeoutError as any).context = context;
    (timeoutError as any).timestamp = new Date().toISOString();
    return timeoutError;
  }

  handleValidationError(error: any, context: ErrorContext): Error {
    const validationError = new Error(`Validation error during ${context.operation}: ${error.message}`);
    (validationError as any).type = 'VALIDATION_ERROR';
    (validationError as any).context = context;
    (validationError as any).timestamp = new Date().toISOString();
    (validationError as any).validationErrors = error.errors;
    return validationError;
  }

  handleAuthenticationError(error: any, context: ErrorContext): Error {
    const authError = new Error(`Authentication error during ${context.operation}: ${error.message}`);
    (authError as any).type = 'AUTHENTICATION_ERROR';
    (authError as any).context = context;
    (authError as any).timestamp = new Date().toISOString();
    return authError;
  }

  handleAuthorizationError(error: any, context: ErrorContext): Error {
    const authzError = new Error(`Authorization error during ${context.operation}: ${error.message}`);
    (authzError as any).type = 'AUTHORIZATION_ERROR';
    (authzError as any).context = context;
    (authzError as any).timestamp = new Date().toISOString();
    return authzError;
  }

  handleServerError(error: any, context: ErrorContext): Error {
    const serverError = new Error(`Server error during ${context.operation}: ${error.message}`);
    (serverError as any).type = 'SERVER_ERROR';
    (serverError as any).context = context;
    (serverError as any).timestamp = new Date().toISOString();
    return serverError;
  }

  // Generic error handler
  handleError(error: any, context: ErrorContext): Error {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 0:
          return this.handleNetworkError(error, context);
        case 400:
          return this.handleValidationError(error, context);
        case 401:
          return this.handleAuthenticationError(error, context);
        case 403:
          return this.handleAuthorizationError(error, context);
        case 408:
          return this.handleTimeoutError(error, context);
        case 500:
        case 502:
        case 503:
        case 504:
          return this.handleServerError(error, context);
        default:
          return this.enhanceError(error, context);
      }
    }

    // Handle other error types
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return this.handleNetworkError(error, context);
    }

    return this.enhanceError(error, context);
  }

  // Utility function to sleep
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Create retry wrapper for API functions
  createRetryWrapper<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    operationName: string,
    config?: Partial<RetryConfig>
  ) {
    return async (...args: T): Promise<R> => {
      const context: ErrorContext = {
        operation: operationName,
        endpoint: 'unknown',
        method: 'unknown',
        timestamp: new Date().toISOString(),
      };

      return this.retry(() => fn(...args), context, config);
    };
  }
}

// Create singleton instance
export const errorHandler = ErrorHandler.getInstance();

// Utility functions for common error handling patterns
export const errorUtils = {
  // Check if error is retryable
  isRetryable: (error: any): boolean => {
    return errorHandler['isRetryableError'](error);
  },

  // Get user-friendly error message
  getUserFriendlyMessage: (error: any): string => {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 0:
          return 'Network connection failed. Please check your internet connection and try again.';
        case 400:
          return 'Invalid request. Please check your input and try again.';
        case 401:
          return 'Authentication required. Please log in and try again.';
        case 403:
          return 'You do not have permission to perform this action.';
        case 404:
          return 'The requested resource was not found.';
        case 408:
          return 'Request timed out. Please try again.';
        case 429:
          return 'Too many requests. Please wait a moment and try again.';
        case 500:
          return 'Server error occurred. Please try again later.';
        case 502:
        case 503:
        case 504:
          return 'Service temporarily unavailable. Please try again later.';
        default:
          return error.message || 'An unexpected error occurred.';
      }
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return 'Network connection failed. Please check your internet connection and try again.';
    }

    return error.message || 'An unexpected error occurred.';
  },

  // Check if error is network related
  isNetworkError: (error: any): boolean => {
    if (error instanceof ApiError) {
      return error.status === 0;
    }
    return error instanceof TypeError && error.message.includes('fetch');
  },

  // Check if error is validation related
  isValidationError: (error: any): boolean => {
    if (error instanceof ApiError) {
      return error.status === 400;
    }
    return error.message && error.message.toLowerCase().includes('validation');
  },

  // Check if error is authentication related
  isAuthenticationError: (error: any): boolean => {
    if (error instanceof ApiError) {
      return error.status === 401;
    }
    return error.message && error.message.toLowerCase().includes('authentication');
  },

  // Check if error is authorization related
  isAuthorizationError: (error: any): boolean => {
    if (error instanceof ApiError) {
      return error.status === 403;
    }
    return error.message && error.message.toLowerCase().includes('authorization');
  },

  // Format error for display
  formatError: (error: any): { message: string; type: string; details?: any } => {
    const message = errorUtils.getUserFriendlyMessage(error);
    const type = errorUtils.getErrorType(error);
    const details = error.context || error.details;

    return { message, type, details };
  },

  // Get error type
  getErrorType: (error: any): string => {
    if (error.type) return error.type;
    if (error instanceof ApiError) {
      switch (error.status) {
        case 0: return 'NETWORK_ERROR';
        case 400: return 'VALIDATION_ERROR';
        case 401: return 'AUTHENTICATION_ERROR';
        case 403: return 'AUTHORIZATION_ERROR';
        case 404: return 'NOT_FOUND_ERROR';
        case 408: return 'TIMEOUT_ERROR';
        case 429: return 'RATE_LIMIT_ERROR';
        case 500: return 'SERVER_ERROR';
        default: return 'UNKNOWN_ERROR';
      }
    }
    return 'UNKNOWN_ERROR';
  },
};

// Export default error handler
export default errorHandler;

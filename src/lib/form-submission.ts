import { ApiError } from './api';

export interface FormSubmissionOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface FormSubmissionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
  status?: number;
  message?: string;
}

export class FormSubmissionError extends Error {
  public status: number;
  public errors?: Record<string, string[]>;
  public isNetworkError: boolean;
  public isValidationError: boolean;

  constructor(
    message: string,
    status: number = 500,
    errors?: Record<string, string[]>,
    isNetworkError: boolean = false
  ) {
    super(message);
    this.name = 'FormSubmissionError';
    this.status = status;
    this.errors = errors;
    this.isNetworkError = isNetworkError;
    this.isValidationError = status === 400 || status === 422;
  }
}

export class FormSubmissionHandler {
  private baseUrl: string;
  private defaultOptions: FormSubmissionOptions;

  constructor(baseUrl: string = '/api', defaultOptions: FormSubmissionOptions = {}) {
    this.baseUrl = baseUrl;
    this.defaultOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000, // 30 seconds
      retries: 3,
      retryDelay: 1000, // 1 second
      ...defaultOptions,
    };
  }

  async submitForm<T = any>(
    endpoint: string,
    data: any,
    options: FormSubmissionOptions = {}
  ): Promise<FormSubmissionResult<T>> {
    const config = { ...this.defaultOptions, ...options };
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const result = await this.executeWithRetry(
        () => this.makeRequest<T>(url, data, config),
        config.retries || 3,
        config.retryDelay || 1000
      );

      return {
        success: true,
        data: result.data,
        message: result.message,
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async makeRequest<T>(
    url: string,
    data: any,
    config: FormSubmissionOptions
  ): Promise<{ data: T; message?: string }> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout || 30000);

    try {
      const response = await fetch(url, {
        method: config.method || 'POST',
        headers: config.headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new FormSubmissionError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          errorData.errors,
          response.status === 0 || response.status >= 500
        );
      }

      const result = await response.json();
      return {
        data: result.data || result,
        message: result.message,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private async executeWithRetry<T>(
    fn: () => Promise<T>,
    retries: number,
    delay: number
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        // Don't retry validation errors or client errors
        if (error instanceof FormSubmissionError && !error.isNetworkError) {
          throw error;
        }

        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
      }
    }

    throw lastError || new Error('Retry failed');
  }

  private handleError(error: unknown): FormSubmissionResult {
    if (error instanceof FormSubmissionError) {
      return {
        success: false,
        error: error.message,
        errors: error.errors,
        status: error.status,
      };
    }

    if (error instanceof ApiError) {
      return {
        success: false,
        error: error.message,
        errors: error.errors,
        status: error.status,
      };
    }

    if (error instanceof Error) {
      // Check if it's a network error
      if (error.name === 'AbortError') {
        return {
          success: false,
          error: 'Request timeout. Please check your connection and try again.',
          status: 408,
        };
      }

      if (error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Network error. Please check your connection and try again.',
          status: 0,
        };
      }

      return {
        success: false,
        error: error.message,
        status: 500,
      };
    }

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
      status: 500,
    };
  }
}

// Create a default form submission handler
export const formSubmissionHandler = new FormSubmissionHandler();

// Utility functions for common form operations
export const formUtils = {
  // Submit event form
  async submitEvent(data: any, isUpdate: boolean = false, eventId?: number) {
    const endpoint = isUpdate ? `/events/${eventId}` : '/events';
    const method = isUpdate ? 'PUT' : 'POST';
    
    return formSubmissionHandler.submitForm(endpoint, data, { method });
  },

  // Submit bus registration form
  async submitBusRegistration(data: any) {
    return formSubmissionHandler.submitForm('/bus', data, { method: 'POST' });
  },

  // Submit authentication form
  async submitAuth(data: any, type: 'login' | 'register') {
    const endpoint = type === 'login' ? '/auth/login' : '/auth/register';
    return formSubmissionHandler.submitForm(endpoint, data, { method: 'POST' });
  },

  // Submit supporter registration form
  async submitSupporterRegistration(data: any) {
    return formSubmissionHandler.submitForm('/supporters', data, { method: 'POST' });
  },

  // Submit operator registration form
  async submitOperatorRegistration(data: any) {
    return formSubmissionHandler.submitForm('/operators', data, { method: 'POST' });
  },

  // Submit fund management form
  async submitFundManagement(data: any, isUpdate: boolean = false, fundId?: number) {
    const endpoint = isUpdate ? `/funds/${fundId}` : '/funds';
    const method = isUpdate ? 'PUT' : 'POST';
    
    return formSubmissionHandler.submitForm(endpoint, data, { method });
  },

  // Submit communication message form
  async submitCommunicationMessage(data: any) {
    return formSubmissionHandler.submitForm('/communication/send', data, { method: 'POST' });
  },

  // Submit task assignment form
  async submitTaskAssignment(data: any) {
    return formSubmissionHandler.submitForm('/tasks', data, { method: 'POST' });
  },

  // Submit voter registration form
  async submitVoterRegistration(data: any) {
    return formSubmissionHandler.submitForm('/voters', data, { method: 'POST' });
  },

  // Submit bus routing form
  async submitBusRouting(data: any, isUpdate: boolean = false, routeId?: string) {
    const endpoint = isUpdate ? `/routes/${routeId}` : '/routes';
    const method = isUpdate ? 'PUT' : 'POST';
    
    return formSubmissionHandler.submitForm(endpoint, data, { method });
  },
};

// React hook for form submission with error handling
export function useFormSubmission() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [errors, setErrors] = React.useState<Record<string, string[]>>({});

  const submitForm = async <T = any>(
    submitFn: () => Promise<FormSubmissionResult<T>>
  ): Promise<FormSubmissionResult<T>> => {
    setIsSubmitting(true);
    setError(null);
    setErrors({});

    try {
      const result = await submitFn();
      
      if (!result.success) {
        setError(result.error || 'Submission failed');
        if (result.errors) {
          setErrors(result.errors);
        }
      }

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearErrors = () => {
    setError(null);
    setErrors({});
  };

  return {
    isSubmitting,
    error,
    errors,
    submitForm,
    clearErrors,
  };
}

// Import React for the hook
import React from 'react';

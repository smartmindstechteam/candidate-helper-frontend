// Environment configuration and API settings
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  maxRetryDelay: number;
  enableLogging: boolean;
  enableRetry: boolean;
  enableOfflineMode: boolean;
}

// Get environment variables with fallbacks
const getEnvVar = (key: string, fallback: string = ''): string => {
  if (typeof window !== 'undefined') {
    // Client-side
    return (window as any).__ENV__?.[key] || process.env[`NEXT_PUBLIC_${key}`] || fallback;
  } else {
    // Server-side
    return process.env[key] || process.env[`NEXT_PUBLIC_${key}`] || fallback;
  }
};

// API Configuration
export const apiConfig: ApiConfig = {
  baseUrl: getEnvVar('BACKEND_URL', 'http://localhost:3000/api'),
  timeout: parseInt(getEnvVar('API_TIMEOUT', '30000')),
  retryAttempts: parseInt(getEnvVar('API_RETRY_ATTEMPTS', '3')),
  retryDelay: parseInt(getEnvVar('API_RETRY_DELAY', '1000')),
  maxRetryDelay: parseInt(getEnvVar('API_MAX_RETRY_DELAY', '10000')),
  enableLogging: getEnvVar('API_ENABLE_LOGGING', 'true') === 'true',
  enableRetry: getEnvVar('API_ENABLE_RETRY', 'true') === 'true',
  enableOfflineMode: getEnvVar('API_ENABLE_OFFLINE_MODE', 'false') === 'true',
};

// Environment detection
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// API Endpoints configuration
export const endpoints = {
  // Events
  events: {
    base: '/events',
    stats: '/events/stats',
    export: '/events/export',
    bulkDelete: '/events/bulk-delete',
    bulkUpdate: '/events/bulk-update',
  },
  
  // Operators
  operators: {
    base: '/operators',
    approve: (id: number) => `/operators/${id}/approve`,
    reject: (id: number) => `/operators/${id}/reject`,
    tasks: (id: number) => `/operators/${id}/tasks`,
    supporters: (id: number) => `/operators/${id}/supporters`,
    analytics: (id: number) => `/operators/${id}/analytics`,
  },
  
  // Supporters
  supporters: {
    base: '/supporters',
    stats: '/supporters/stats',
    export: '/supporters/export',
    approve: (id: number) => `/supporters/${id}/approve`,
    reject: (id: number) => `/supporters/${id}/reject`,
  },
  
  // Bus/Transport
  bus: {
    base: '/buses',
    routes: '/routes',
    drivers: '/drivers',
    schedules: '/schedules',
    analytics: '/transport/analytics',
  },
  
  // Funds
  funds: {
    base: '/funds',
    stats: '/funds/stats',
    export: '/funds/export',
  },
  
  // Communication
  communication: {
    base: '/communication',
    messages: '/communication/messages',
    send: '/communication/send',
    stats: '/communication/stats',
    groups: '/communication/groups',
  },
  
  // Locations
  locations: {
    regions: '/locations/regions',
    districts: '/locations/districts',
    pollingStations: (districtId: number) => `/locations/districts/${districtId}/polling-stations`,
  },
} as const;

// Request headers configuration
export const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
};

// Add authorization header if token is available
export const getHeaders = (token?: string): Record<string, string> => {
  const headers = { ...defaultHeaders };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API response timeout configuration
export const timeoutConfig = {
  default: 30000, // 30 seconds
  upload: 300000, // 5 minutes for file uploads
  download: 60000, // 1 minute for downloads
  longRunning: 300000, // 5 minutes for long-running operations
} as const;

// Retry configuration
export const retryConfig = {
  maxRetries: apiConfig.retryAttempts,
  baseDelay: apiConfig.retryDelay,
  maxDelay: apiConfig.maxRetryDelay,
  backoffMultiplier: 2,
  retryableStatusCodes: [0, 408, 429, 500, 502, 503, 504],
  nonRetryableStatusCodes: [400, 401, 403, 404, 422],
} as const;

// Pagination configuration
export const paginationConfig = {
  defaultPageSize: 10,
  maxPageSize: 100,
  defaultPage: 1,
} as const;

// Cache configuration
export const cacheConfig = {
  defaultTTL: 300000, // 5 minutes
  maxSize: 100, // Maximum number of cached items
  enableCache: !isDevelopment, // Disable cache in development
} as const;

// Validation configuration
export const validationConfig = {
  maxStringLength: 1000,
  maxArrayLength: 100,
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  requiredFields: {
    event: ['title', 'type', 'start_time', 'end_time'],
    operator: ['firstname', 'lastname', 'role'],
    supporter: ['firstname', 'lastname'],
    bus: ['busNumber', 'plateNumber', 'model', 'manufacturer'],
    fund: ['title', 'amount', 'category', 'source'],
    message: ['title', 'content', 'message_type', 'recipient_type'],
  },
} as const;

// Error handling configuration
export const errorConfig = {
  enableErrorLogging: true,
  enableErrorReporting: isProduction,
  maxErrorLogSize: 1000,
  errorReportingEndpoint: '/api/errors',
} as const;

// Feature flags
export const features = {
  enableOfflineMode: apiConfig.enableOfflineMode,
  enableRealTimeUpdates: getEnvVar('ENABLE_REAL_TIME_UPDATES', 'false') === 'true',
  enablePushNotifications: getEnvVar('ENABLE_PUSH_NOTIFICATIONS', 'false') === 'true',
  enableAnalytics: getEnvVar('ENABLE_ANALYTICS', 'true') === 'true',
  enableDebugMode: isDevelopment,
} as const;

// API versioning
export const apiVersion = {
  current: 'v1',
  supported: ['v1'],
  default: 'v1',
} as const;

// Export utility functions
export const configUtils = {
  // Get full API URL
  getApiUrl: (endpoint: string): string => {
    const baseUrl = apiConfig.baseUrl.endsWith('/') ? apiConfig.baseUrl.slice(0, -1) : apiConfig.baseUrl;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${cleanEndpoint}`;
  },
  
  // Check if feature is enabled
  isFeatureEnabled: (feature: keyof typeof features): boolean => {
    return features[feature];
  },
  
  // Get timeout for operation type
  getTimeout: (operationType: keyof typeof timeoutConfig): number => {
    return timeoutConfig[operationType];
  },
  
  // Validate configuration
  validateConfig: (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!apiConfig.baseUrl) {
      errors.push('BACKEND_URL is required');
    }
    
    if (apiConfig.timeout <= 0) {
      errors.push('API_TIMEOUT must be greater than 0');
    }
    
    if (apiConfig.retryAttempts < 0) {
      errors.push('API_RETRY_ATTEMPTS must be non-negative');
    }
    
    if (apiConfig.retryDelay <= 0) {
      errors.push('API_RETRY_DELAY must be greater than 0');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  },
  
  // Get environment info
  getEnvironmentInfo: () => ({
    nodeEnv: process.env.NODE_ENV,
    isDevelopment,
    isProduction,
    isTest,
    apiUrl: apiConfig.baseUrl,
    features: Object.entries(features).filter(([, enabled]) => enabled).map(([name]) => name),
  }),
};

// Validate configuration on import
const configValidation = configUtils.validateConfig();
if (!configValidation.isValid) {
  console.error('API Configuration validation failed:', configValidation.errors);
  if (isProduction) {
    throw new Error(`API Configuration validation failed: ${configValidation.errors.join(', ')}`);
  }
}

export default apiConfig;

# API Services Documentation

This directory contains comprehensive CRUD operations and API services for the candidate-helper application. All services use the `BACKEND_URL` environment variable for backend connectivity.

## Table of Contents

- [Overview](#overview)
- [Environment Setup](#environment-setup)
- [Core Services](#core-services)
- [React Hooks](#react-hooks)
- [Error Handling](#error-handling)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)

## Overview

The API services provide a complete set of CRUD operations for all modules in the application:

- **Events API** - Event management and scheduling
- **Operators API** - Operator registration and management
- **Supporters API** - Supporter registration and management
- **Bus API** - Transportation and logistics management
- **Funds API** - Financial management and tracking
- **Communication API** - Messaging and communication

## Environment Setup

### 1. Environment Variables

Create a `.env.local` file in your project root:

```env
# Backend API URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000/api
# or
BACKEND_URL=http://localhost:3000/api

# Optional API Configuration
API_TIMEOUT=30000
API_RETRY_ATTEMPTS=3
API_RETRY_DELAY=1000
API_MAX_RETRY_DELAY=10000
API_ENABLE_LOGGING=true
API_ENABLE_RETRY=true
API_ENABLE_OFFLINE_MODE=false
```

### 2. Installation

The services are already included in the project. No additional installation is required.

## Core Services

### Events API

```typescript
import { eventsApi } from '@/lib/events-api';

// Get all events
const events = await eventsApi.getAll({ page: 1, limit: 10 });

// Create event
const newEvent = await eventsApi.create({
  title: 'Campaign Rally',
  type: 'rally',
  // ... other fields
});

// Update event
const updatedEvent = await eventsApi.update(1, {
  status: 'completed',
  actual_attendance: 2500,
});

// Delete event
await eventsApi.delete(1);

// Search events
const searchResults = await eventsApi.search('rally', {
  status: ['planned', 'scheduled'],
  type: ['rally'],
});

// Get event statistics
const stats = await eventsApi.getStats();

// Export events
const csvData = await eventsApi.export({
  status: ['completed'],
  date_from: '2024-01-01',
  date_to: '2024-12-31',
});
```

### Operators API

```typescript
import { operatorsApi } from '@/lib/operators-api';

// Get all operators
const operators = await operatorsApi.getAll({ page: 1, limit: 10 });

// Create operator
const newOperator = await operatorsApi.create({
  firstname: 'Ahmed',
  lastname: 'Hassan',
  role: 'operator',
  // ... other fields
});

// Approve operator
await operatorsApi.approve(1);

// Reject operator
await operatorsApi.reject(1, 'Incomplete documentation');

// Get operators by status
const pendingOps = await operatorsApi.getPending();
const approvedOps = await operatorsApi.getApproved();

// Bulk operations
await operatorsApi.bulkApprove([1, 2, 3]);
await operatorsApi.bulkReject([4, 5, 6], 'Background check failed');
```

### Supporters API

```typescript
import { supportersApi } from '@/lib/supporters-api';

// Get all supporters
const supporters = await supportersApi.getAll({ page: 1, limit: 10 });

// Create supporter
const newSupporter = await supportersApi.create({
  firstname: 'Fatima',
  lastname: 'Ali',
  // ... other fields
});

// Get supporters by region
const regionSupporters = await supportersApi.getByRegion(1);

// Get supporters by district
const districtSupporters = await supportersApi.getByDistrict(1);

// Get supporter demographics
const demographics = await supportersApi.getDemographics();
```

### Bus API

```typescript
import { busApi } from '@/lib/bus-api';

// Bus operations
const buses = await busApi.buses.getAll();
const newBus = await busApi.buses.create({
  busNumber: 'BUS-001',
  plateNumber: 'SL-001-ABC',
  // ... other fields
});

// Route operations
const routes = await busApi.routes.getAll();
const newRoute = await busApi.routes.create({
  name: 'Hargeisa - Berbera',
  startLocation: 'Hargeisa',
  endLocation: 'Berbera',
  // ... other fields
});

// Driver operations
const drivers = await busApi.drivers.getAll();
const newDriver = await busApi.drivers.create({
  name: 'Omar Mohamed',
  licenseNumber: 'SL-DL-001',
  // ... other fields
});

// Schedule operations
const schedules = await busApi.schedules.getAll();
const newSchedule = await busApi.schedules.create({
  busId: '1',
  routeId: '1',
  driverId: '1',
  departureTime: '08:00',
  arrivalTime: '09:30',
  // ... other fields
});

// Analytics
const analytics = await busApi.analytics();
```

### Funds API

```typescript
import { fundsApi } from '@/lib/funds-api';

// Get all funds
const funds = await fundsApi.getAll({ page: 1, limit: 10 });

// Create fund
const newFund = await fundsApi.create({
  title: 'Campaign Donation',
  amount: 5000,
  category: 'donation',
  source: 'individual',
  // ... other fields
});

// Approve fund
await fundsApi.approve(1);

// Get fund summary
const summary = await fundsApi.getSummary();

// Get funds by category
const donations = await fundsApi.getByCategory(['donation', 'sponsorship']);
```

### Communication API

```typescript
import { communicationApi } from '@/lib/communication-api';

// Send message
const smsResult = await communicationApi.messages.send({
  title: 'Important Update',
  content: 'Thank you for your support!',
  message_type: 'sms',
  recipient_type: 'supporters',
  // ... other fields
});

// Get messages
const messages = await communicationApi.messages.getAll();

// Get message analytics
const analytics = await communicationApi.getAnalytics();

// Create recipient group
const group = await communicationApi.groups.create({
  name: 'Active Supporters',
  recipient_type: 'supporters',
  recipient_ids: [1, 2, 3],
});
```

## React Hooks

### Basic Hooks

```typescript
import { useEvents, useCreateEvent, useUpdateEvent } from '@/hooks/use-api';

function EventsComponent() {
  const { data: events, loading, error, refetch } = useEvents({
    page: 1,
    limit: 10,
    status: ['planned', 'scheduled'],
  });

  const { create: createEvent, loading: creating, error: createError } = useCreateEvent();
  const { update: updateEvent, loading: updating, error: updateError } = useUpdateEvent();

  const handleCreate = async (eventData) => {
    try {
      const result = await createEvent(eventData);
      if (result.success) {
        refetch(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {events.map(event => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  );
}
```

### Paginated Hooks

```typescript
import { useEvents } from '@/hooks/use-api';

function PaginatedEventsComponent() {
  const {
    data: events,
    pagination,
    loading,
    error,
    updateParams,
  } = useEvents({ page: 1, limit: 10 });

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage });
  };

  return (
    <div>
      {events.map(event => (
        <div key={event.id}>{event.title}</div>
      ))}
      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
```

## Error Handling

### Basic Error Handling

```typescript
import { errorUtils } from '@/lib/error-handling';

try {
  const result = await eventsApi.create(eventData);
  if (result.success) {
    console.log('Event created successfully');
  } else {
    console.error('Failed to create event:', result.message);
  }
} catch (error) {
  const userFriendlyMessage = errorUtils.getUserFriendlyMessage(error);
  console.error('Error:', userFriendlyMessage);
  
  // Check error type
  if (errorUtils.isNetworkError(error)) {
    console.log('Network error - check connection');
  } else if (errorUtils.isValidationError(error)) {
    console.log('Validation error - check input');
  }
}
```

### Retry Logic

```typescript
import { errorHandler } from '@/lib/error-handling';

const result = await errorHandler.retry(
  () => eventsApi.getById(1),
  {
    operation: 'get_event',
    endpoint: '/events/1',
    method: 'GET',
    timestamp: new Date().toISOString(),
  },
  {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 5000,
  }
);
```

## Configuration

### Environment Configuration

```typescript
import { apiConfig, configUtils } from '@/lib/config';

// Check configuration
const validation = configUtils.validateConfig();
if (!validation.isValid) {
  console.error('Configuration errors:', validation.errors);
}

// Check features
if (configUtils.isFeatureEnabled('enableOfflineMode')) {
  console.log('Offline mode enabled');
}

// Get environment info
const envInfo = configUtils.getEnvironmentInfo();
console.log('Environment:', envInfo);
```

## Usage Examples

### Complete CRUD Example

```typescript
import { eventsApi } from '@/lib/events-api';
import { errorUtils } from '@/lib/error-handling';

async function completeEventManagement() {
  try {
    // 1. Create event
    const createResult = await eventsApi.create({
      title: 'Campaign Rally',
      type: 'rally',
      category: 'Political',
      timezone: 'Africa/Mogadishu',
      description: 'Major campaign rally',
      start_time: '2024-02-15T10:00:00Z',
      end_time: '2024-02-15T12:00:00Z',
      recurrence: 'none',
      venue: 'Hargeisa Stadium',
      city: 'Hargeisa',
      district_id: 1,
      region_id: 1,
      address: 'Hargeisa Stadium',
      max_capacity: 5000,
      budget_amount: 10000,
      status: 'planned',
      organizer_name: 'Ahmed Hassan',
      organizer_contact: '+252-61-123-4567',
    });

    if (!createResult.success) {
      throw new Error(createResult.message);
    }

    const eventId = createResult.data.id;

    // 2. Update event
    const updateResult = await eventsApi.update(eventId, {
      id: eventId,
      expected_attendance: 3000,
      status: 'scheduled',
    });

    if (!updateResult.success) {
      throw new Error(updateResult.message);
    }

    // 3. Get event details
    const eventResult = await eventsApi.getById(eventId);
    if (eventResult.success) {
      console.log('Event details:', eventResult.data);
    }

    // 4. Search events
    const searchResult = await eventsApi.search('rally', {
      status: ['scheduled'],
      type: ['rally'],
    });

    if (searchResult.success) {
      console.log('Found events:', searchResult.data.length);
    }

    // 5. Export events
    const exportResult = await eventsApi.export({
      status: ['completed'],
      date_from: '2024-01-01',
      date_to: '2024-12-31',
    });

    if (exportResult.success) {
      // Download CSV
      const url = URL.createObjectURL(exportResult.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'events-export.csv';
      link.click();
      URL.revokeObjectURL(url);
    }

    // 6. Delete event (if needed)
    // const deleteResult = await eventsApi.delete(eventId);
    // if (deleteResult.success) {
    //   console.log('Event deleted successfully');
    // }

  } catch (error) {
    console.error('Event management failed:', errorUtils.getUserFriendlyMessage(error));
  }
}
```

### Bulk Operations Example

```typescript
import { operatorsApi } from '@/lib/operators-api';

async function bulkOperatorManagement() {
  try {
    // Get all pending operators
    const pendingResult = await operatorsApi.getPending();
    
    if (pendingResult.success && pendingResult.data.length > 0) {
      const operatorIds = pendingResult.data.map(op => op.id);
      
      // Bulk approve
      const approveResult = await operatorsApi.bulkApprove(operatorIds);
      if (approveResult.success) {
        console.log('Bulk approval completed:', approveResult.message);
      }
    }

    // Get operators by role
    const supervisorResult = await operatorsApi.getByRole(['supervisor']);
    if (supervisorResult.success) {
      console.log('Supervisors:', supervisorResult.data.length);
    }

    // Export operators
    const exportResult = await operatorsApi.export({
      status: ['approved'],
      role: ['operator', 'supervisor'],
    });

    if (exportResult.success) {
      const url = URL.createObjectURL(exportResult.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'operators-export.csv';
      link.click();
      URL.revokeObjectURL(url);
    }

  } catch (error) {
    console.error('Bulk operations failed:', errorUtils.getUserFriendlyMessage(error));
  }
}
```

## API Reference

### Common Response Format

All API methods return a consistent response format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message?: string;
  errors?: string[];
}

interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}
```

### Error Handling

All errors are wrapped in a consistent format with user-friendly messages:

```typescript
interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
  context?: ErrorContext;
  timestamp?: string;
}
```

### Configuration Options

```typescript
interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  maxRetryDelay: number;
  enableLogging: boolean;
  enableRetry: boolean;
  enableOfflineMode: boolean;
}
```

## Best Practices

1. **Always check the `success` property** before using the `data` property
2. **Use error handling** with `errorUtils.getUserFriendlyMessage()` for user-facing errors
3. **Implement retry logic** for critical operations using `errorHandler.retry()`
4. **Use React hooks** for state management in components
5. **Validate configuration** on application startup
6. **Monitor error logs** in production using `errorHandler.getErrorStats()`
7. **Use pagination** for large datasets to improve performance
8. **Implement proper loading states** using the `loading` property from hooks
9. **Cache frequently accessed data** when appropriate
10. **Use bulk operations** for multiple items to improve efficiency

## Troubleshooting

### Common Issues

1. **Network Errors**: Check `BACKEND_URL` environment variable
2. **Authentication Errors**: Ensure user is logged in and token is valid
3. **Validation Errors**: Check input data against required fields
4. **Timeout Errors**: Increase `API_TIMEOUT` configuration
5. **Retry Failures**: Check `API_RETRY_ATTEMPTS` and network connectivity

### Debug Mode

Enable debug mode in development:

```env
API_ENABLE_LOGGING=true
NODE_ENV=development
```

This will log all API requests and responses to the console.

### Error Monitoring

Monitor errors in production:

```typescript
import { errorHandler } from '@/lib/error-handling';

// Get error statistics
const stats = errorHandler.getErrorStats();
console.log('Error statistics:', stats);

// Get recent errors
const recentErrors = errorHandler.getErrorLogs();
console.log('Recent errors:', recentErrors.slice(-10));
```

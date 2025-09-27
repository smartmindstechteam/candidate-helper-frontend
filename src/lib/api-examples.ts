// Examples of how to use the API services with error handling and retry logic
import { eventsApi } from './events-api';
import { operatorsApi } from './operators-api';
import { supportersApi } from './supporters-api';
import { busApi } from './bus-api';
import { fundsApi } from './funds-api';
import { communicationApi } from './communication-api';
import { errorHandler, errorUtils } from './error-handling';
import { configUtils } from './config';
import { useEvents, useCreateEvent } from '../hooks/use-api';

// Example 1: Basic CRUD operations with error handling
export async function exampleBasicCrudOperations() {
  try {
    // Create a new event
    const newEvent = await eventsApi.create({
      title: 'Campaign Rally',
      type: 'rally',
      category: 'Political',
      timezone: 'Africa/Mogadishu',
      description: 'Major campaign rally in Hargeisa',
      start_time: '2024-02-15T10:00:00Z',
      end_time: '2024-02-15T12:00:00Z',
      recurrence: 'none',
      venue: 'Hargeisa Stadium',
      city: 'Hargeisa',
      district_id: 1,
      region_id: 1,
      address: 'Hargeisa Stadium, Hargeisa',
      max_capacity: 5000,
      budget_amount: 10000,
      status: 'planned',
      organizer_name: 'Ahmed Hassan',
      organizer_contact: '+252-61-123-4567',
    });

    if (newEvent.success && newEvent.data) {
      console.log('Event created successfully:', newEvent.data);
      
      // Update the event
      const updatedEvent = await eventsApi.update(newEvent.data.id, {
        id: newEvent.data.id,
        expected_attendance: 3000,
        actual_attendance: 2500,
        status: 'completed',
      });

      if (updatedEvent.success && updatedEvent.data) {
        console.log('Event updated successfully:', updatedEvent.data);
      }
    }
  } catch (error) {
    console.error('Error in basic CRUD operations:', errorUtils.getUserFriendlyMessage(error));
  }
}

// Example 2: Using React hooks with error handling
export function exampleReactHooksUsage() {
  // This would be used in a React component
  const { data: events, loading, error, refetch } = useEvents({
    page: 1,
    limit: 10,
    status: ['planned', 'scheduled'],
  });

  const { create: createEvent, loading: creating, error: createError } = useCreateEvent();

  const handleCreateEvent = async (eventData: any) => {
    try {
      const result = await createEvent(eventData);
      if (result.success) {
        refetch(); // Refresh the events list
        console.log('Event created successfully');
      }
    } catch (error) {
      console.error('Failed to create event:', errorUtils.getUserFriendlyMessage(error));
    }
  };

  return {
    events,
    loading,
    error: errorUtils.getUserFriendlyMessage(error),
    createEvent: handleCreateEvent,
    creating,
    createError: errorUtils.getUserFriendlyMessage(createError),
  };
}

// Example 3: Bulk operations with retry logic
export async function exampleBulkOperations() {
  try {
    // Get all pending operators
    const pendingOperators = await operatorsApi.getPending();
    
    if (pendingOperators.success && pendingOperators.data.length > 0) {
      const operatorIds = pendingOperators.data.map(op => op.id);
      
      // Bulk approve operators with retry logic
      const bulkApproveResult = await errorHandler.retry(
        () => operatorsApi.bulkApprove(operatorIds),
        {
          operation: 'bulk_approve_operators',
          endpoint: '/operators/bulk-approve',
          method: 'POST',
          timestamp: new Date().toISOString(),
        }
      );

      if (bulkApproveResult.success) {
        console.log('Bulk approval completed:', bulkApproveResult.message);
      }
    }
  } catch (error) {
    console.error('Bulk operations failed:', errorUtils.getUserFriendlyMessage(error));
  }
}

// Example 4: Search and filtering with error handling
export async function exampleSearchAndFiltering() {
  try {
    // Search events with filters
    const searchResult = await eventsApi.search('rally', {
      status: ['planned', 'scheduled'],
      type: ['rally', 'meeting'],
      date_from: '2024-01-01',
      date_to: '2024-12-31',
    });

    if (searchResult.success && searchResult.data) {
      console.log(`Found ${searchResult.data.length} events matching search criteria`);
    }

    // Get supporters by region
    const supportersByRegion = await supportersApi.getByRegion(1);
    if (supportersByRegion.success && supportersByRegion.data) {
      console.log(`Found ${supportersByRegion.data.length} supporters in region 1`);
    }

    // Get funds by category
    const fundsByCategory = await fundsApi.getByCategory(['donation', 'sponsorship']);
    if (fundsByCategory.success && fundsByCategory.data) {
      console.log(`Found ${fundsByCategory.data.length} funds in specified categories`);
    }
  } catch (error) {
    console.error('Search and filtering failed:', errorUtils.getUserFriendlyMessage(error));
  }
}

// Example 5: Analytics and reporting
export async function exampleAnalyticsAndReporting() {
  try {
    // Get event statistics
    const eventStats = await eventsApi.getStats();
    if (eventStats.success && eventStats.data) {
      console.log('Event statistics:', eventStats.data);
    }

    // Get supporter demographics
    const supporterDemographics = await supportersApi.getDemographics();
    if (supporterDemographics.success && supporterDemographics.data) {
      console.log('Supporter demographics:', supporterDemographics.data);
    }

    // Get fund summary
    const fundSummary = await fundsApi.getSummary();
    if (fundSummary.success && fundSummary.data) {
      console.log('Fund summary:', fundSummary.data);
    }

    // Get communication analytics
    const commAnalytics = await communicationApi.getAnalytics();
    if (commAnalytics.success && commAnalytics.data) {
      console.log('Communication analytics:', commAnalytics.data);
    }
  } catch (error) {
    console.error('Analytics failed:', errorUtils.getUserFriendlyMessage(error));
  }
}

// Example 6: Export operations
export async function exampleExportOperations() {
  try {
    // Export events
    const eventExport = await eventsApi.export({
      status: ['completed'],
      date_from: '2024-01-01',
      date_to: '2024-12-31',
    });

    if (eventExport.success && eventExport.data) {
      // Create download link
      const url = URL.createObjectURL(eventExport.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'events-export.csv';
      link.click();
      URL.revokeObjectURL(url);
    }

    // Export supporters
    const supporterExport = await supportersApi.export({
      status: ['approved'],
      region_id: 1,
    });

    if (supporterExport.success && supporterExport.data) {
      const url = URL.createObjectURL(supporterExport.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'supporters-export.csv';
      link.click();
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error('Export operations failed:', errorUtils.getUserFriendlyMessage(error));
  }
}

// Example 7: Communication operations
export async function exampleCommunicationOperations() {
  try {
    // Send SMS to all supporters
    const smsResult = await communicationApi.messages.send({
      title: 'Important Update',
      content: 'Thank you for your support! We have an important update for you.',
      message_type: 'sms',
      recipient_type: 'supporters',
      priority: 'medium',
      language: 'somali',
      track_opens: true,
      track_responses: true,
    });

    if (smsResult.success && smsResult.data) {
      console.log('SMS sent successfully:', smsResult.data);
    }

    // Send email to specific operators
    const emailResult = await communicationApi.messages.send({
      title: 'Task Assignment',
      content: 'You have been assigned new tasks. Please check your dashboard.',
      message_type: 'email',
      recipient_type: 'specific',
      recipient_ids: [1, 2, 3],
      priority: 'high',
      language: 'english',
      track_opens: true,
      track_clicks: true,
    });

    if (emailResult.success && emailResult.data) {
      console.log('Email sent successfully:', emailResult.data);
    }

    // Get message statistics
    const messageStats = await communicationApi.getStats();
    if (messageStats.success && messageStats.data) {
      console.log('Message statistics:', messageStats.data);
    }
  } catch (error) {
    console.error('Communication operations failed:', errorUtils.getUserFriendlyMessage(error));
  }
}

// Example 8: Bus/Transport operations
export async function exampleBusOperations() {
  try {
    // Create a new bus
    const newBus = await busApi.buses.create({
      busNumber: 'BUS-004',
      plateNumber: 'SL-004-JKL',
      model: 'Hiace',
      manufacturer: 'Toyota',
      year: 2023,
      color: 'White',
      capacity: 15,
      busType: 'minibus',
      fuelType: 'diesel',
      status: 'active',
      lastMaintenance: new Date('2024-01-01'),
      nextMaintenance: new Date('2024-04-01'),
      insuranceExpiry: new Date('2024-12-31'),
      inspectionDate: new Date('2024-01-01'),
      isGpsEnabled: true,
      hasWifi: false,
      hasAirConditioning: true,
      isAccessible: false,
      notes: 'New bus for short routes',
      emergencyContact: 'Mohamed Ali',
      emergencyPhone: '+252-61-456-7890',
    });

    if (newBus.success && newBus.data) {
      console.log('Bus created successfully:', newBus.data);

      // Create a route
      const newRoute = await busApi.routes.create({
        name: 'Hargeisa - Sheikh',
        description: 'Route connecting Hargeisa to Sheikh',
        startLocation: 'Hargeisa',
        endLocation: 'Sheikh',
        distance: 60,
        estimatedDuration: 45,
        stops: [
          {
            id: '1',
            name: 'Hargeisa Central',
            address: 'Hargeisa City Center',
            coordinates: { lat: 9.5616, lng: 44.0650 },
            order: 1,
            estimatedArrival: 0,
          },
          {
            id: '2',
            name: 'Sheikh Center',
            address: 'Sheikh Town Center',
            coordinates: { lat: 9.3333, lng: 44.1667 },
            order: 2,
            estimatedArrival: 45,
          },
        ],
        isActive: true,
      });

      if (newRoute.success && newRoute.data) {
        console.log('Route created successfully:', newRoute.data);

        // Create a schedule
        const newSchedule = await busApi.schedules.create({
          busId: newBus.data.id,
          routeId: newRoute.data.id,
          driverId: '1', // Assuming driver exists
          departureTime: '08:00',
          arrivalTime: '08:45',
          dayOfWeek: 1, // Monday
          recurrence: 'daily',
          status: 'scheduled',
          isActive: true,
        });

        if (newSchedule.success && newSchedule.data) {
          console.log('Schedule created successfully:', newSchedule.data);
        }
      }
    }
  } catch (error) {
    console.error('Bus operations failed:', errorUtils.getUserFriendlyMessage(error));
  }
}

// Example 9: Error handling and retry patterns
export async function exampleErrorHandlingPatterns() {
  try {
    // Example with custom retry configuration
    const result = await errorHandler.retry(
      () => eventsApi.getById(999), // Non-existent event
      {
        operation: 'get_event_by_id',
        endpoint: '/events/999',
        method: 'GET',
        timestamp: new Date().toISOString(),
      },
      {
        maxRetries: 2,
        baseDelay: 500,
        maxDelay: 2000,
        retryCondition: (error) => error.status === 500, // Only retry on server errors
      }
    );

    console.log('Result after retry:', result);
  } catch (error) {
    console.error('Error after retries:', errorUtils.getUserFriendlyMessage(error));
    
    // Check error type and handle accordingly
    if (errorUtils.isNetworkError(error)) {
      console.log('Network error detected - check internet connection');
    } else if (errorUtils.isValidationError(error)) {
      console.log('Validation error - check input data');
    } else if (errorUtils.isAuthenticationError(error)) {
      console.log('Authentication error - user needs to log in');
    }
  }
}

// Example 10: Configuration and environment handling
export function exampleConfigurationUsage() {
  // Check if features are enabled
  if (configUtils.isFeatureEnabled('enableOfflineMode')) {
    console.log('Offline mode is enabled');
  }

  if (configUtils.isFeatureEnabled('enableRealTimeUpdates')) {
    console.log('Real-time updates are enabled');
  }

  // Get environment information
  const envInfo = configUtils.getEnvironmentInfo();
  console.log('Environment info:', envInfo);

  // Get API URL for specific endpoint
  const eventsUrl = configUtils.getApiUrl('/events');
  console.log('Events API URL:', eventsUrl);

  // Get timeout for specific operation
  const uploadTimeout = configUtils.getTimeout('upload');
  console.log('Upload timeout:', uploadTimeout);
}

// Example 11: Monitoring and debugging
export function exampleMonitoringAndDebugging() {
  // Get error statistics
  const errorStats = errorHandler.getErrorStats();
  console.log('Error statistics:', errorStats);

  // Get recent errors
  const recentErrors = errorHandler.getErrorLogs();
  console.log('Recent errors:', recentErrors.slice(-5)); // Last 5 errors

  // Clear error logs (useful for testing)
  // errorHandler.clearErrorLogs();

  // Check if configuration is valid
  const configValidation = configUtils.validateConfig();
  if (!configValidation.isValid) {
    console.error('Configuration validation failed:', configValidation.errors);
  }
}

// Export all examples
export const apiExamples = {
  basicCrud: exampleBasicCrudOperations,
  reactHooks: exampleReactHooksUsage,
  bulkOperations: exampleBulkOperations,
  searchAndFiltering: exampleSearchAndFiltering,
  analyticsAndReporting: exampleAnalyticsAndReporting,
  exportOperations: exampleExportOperations,
  communicationOperations: exampleCommunicationOperations,
  busOperations: exampleBusOperations,
  errorHandling: exampleErrorHandlingPatterns,
  configuration: exampleConfigurationUsage,
  monitoring: exampleMonitoringAndDebugging,
};

export default apiExamples;

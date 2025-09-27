// Main export file for all API services and utilities
export { api } from './api';
export type { ApiError, ApiResponse, PaginatedResponse } from './api';
export { eventsApi } from './events-api';
export { operatorsApi } from './operators-api';
export { supportersApi } from './supporters-api';
export { busApi } from './bus-api';
export { fundsApi } from './funds-api';
export { communicationApi } from './communication-api';
export { errorHandler, errorUtils } from './error-handling';
export { apiConfig, configUtils, endpoints } from './config';

// Import for default export
import { api } from './api';
import { eventsApi } from './events-api';
import { operatorsApi } from './operators-api';
import { supportersApi } from './supporters-api';
import { busApi } from './bus-api';
import { fundsApi } from './funds-api';
import { communicationApi } from './communication-api';
import { errorHandler, errorUtils } from './error-handling';
import { apiConfig, configUtils } from './config';

// React hooks
export {
  useApi,
  usePaginatedApi,
  useEvents,
  useEvent,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  useOperators,
  useOperator,
  useCreateOperator,
  useUpdateOperator,
  useDeleteOperator,
  useApproveOperator,
  useRejectOperator,
  useSupporters,
  useSupporter,
  useCreateSupporter,
  useUpdateSupporter,
  useDeleteSupporter,
  useApproveSupporter,
  useRejectSupporter,
  useBuses,
  useBus,
  useCreateBus,
  useUpdateBus,
  useDeleteBus,
  useRoutes,
  useRoute,
  useCreateRoute,
  useUpdateRoute,
  useDeleteRoute,
  useDrivers,
  useDriver,
  useCreateDriver,
  useUpdateDriver,
  useDeleteDriver,
  useSchedules,
  useSchedule,
  useCreateSchedule,
  useUpdateSchedule,
  useDeleteSchedule,
  useFunds,
  useFund,
  useCreateFund,
  useUpdateFund,
  useDeleteFund,
  useMessages,
  useSendMessage,
  useRegions,
  useDistrictsByRegion,
  useAllDistricts,
  usePollingStationsByDistrict,
  useEventStats,
  useOperatorStats,
  useSupporterStats,
  useBusAnalytics,
  useFundStats,
  useCommunicationStats,
  useRetry,
  useErrorHandler,
  useNetworkErrorCheck,
} from '../hooks/use-api';

// Examples
export { apiExamples } from './api-examples';

// Types
export type { Event, EventCreateRequest, EventUpdateRequest, EventFilters, EventSearchParams } from '../types/event';
export type { Operator, OperatorCreateRequest, OperatorUpdateRequest } from '../types/operator';
export type { Supporter, SupporterCreateRequest, SupporterUpdateRequest } from '../types/supporter';
export type { Bus, Route, Schedule, Driver, BusAnalytics } from './bus';

// Configuration types
export type { ApiConfig } from './config';
export type { RetryConfig, ErrorContext } from './error-handling';

// Default export
export default {
  api,
  events: eventsApi,
  operators: operatorsApi,
  supporters: supportersApi,
  bus: busApi,
  funds: fundsApi,
  communication: communicationApi,
  errorHandler,
  errorUtils,
  config: apiConfig,
  configUtils,
};

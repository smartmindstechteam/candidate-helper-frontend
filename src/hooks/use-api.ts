// React hooks for API operations with error handling and loading states
import { useState, useCallback, useEffect } from 'react';
import { api, ApiError, PaginatedResponse, ApiResponse } from '../lib/api';

// Generic hook for API operations
export function useApi<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = [],
  immediate: boolean = true
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, execute, refetch: execute };
}

// Hook for paginated data
export function usePaginatedApi<T>(
  apiFunction: (params?: any) => Promise<PaginatedResponse<T>>,
  initialParams: any = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState(initialParams);

  const fetchData = useCallback(async (newParams?: any) => {
    try {
      setLoading(true);
      setError(null);
      const searchParams = { ...params, ...newParams };
      const result = await apiFunction(searchParams);
      setData(result.data);
      setPagination(result.pagination);
      setParams(searchParams);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction, params]);

  const refetch = useCallback(() => fetchData(), [fetchData]);
  const updateParams = useCallback((newParams: any) => fetchData(newParams), [fetchData]);

  useEffect(() => {
    fetchData();
  }, []);

  return {
    data,
    pagination,
    loading,
    error,
    refetch,
    updateParams,
    setParams: updateParams,
  };
}

// Events hooks
export function useEvents(params?: any) {
  return usePaginatedApi(api.events.getAll, params);
}

export function useEvent(id: number) {
  return useApi(() => api.events.getById(id), [id]);
}

export function useCreateEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.events.create(data);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useUpdateEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (id: number, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.events.update(id, data);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeleteEvent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteEvent = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.events.delete(id);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteEvent, loading, error };
}

// Operators hooks
export function useOperators(params?: any) {
  return usePaginatedApi(api.operators.getAll, params);
}

export function useOperator(id: number) {
  return useApi(() => api.operators.getById(id), [id]);
}

export function useCreateOperator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.operators.create(data);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useUpdateOperator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (id: number, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.operators.update(id, data);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeleteOperator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteOperator = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.operators.delete(id);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteOperator, loading, error };
}

export function useApproveOperator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approve = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.operators.approve(id);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { approve, loading, error };
}

export function useRejectOperator() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reject = useCallback(async (id: number, reason?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.operators.reject(id, reason);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { reject, loading, error };
}

// Supporters hooks
export function useSupporters(params?: any) {
  return usePaginatedApi(api.supporters.getAll, params);
}

export function useSupporter(id: number) {
  return useApi(() => api.supporters.getById(id), [id]);
}

export function useCreateSupporter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.supporters.create(data);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useUpdateSupporter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (id: number, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.supporters.update(id, data);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeleteSupporter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSupporter = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.supporters.delete(id);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteSupporter, loading, error };
}

export function useApproveSupporter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approve = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.supporters.approve(id);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { approve, loading, error };
}

export function useRejectSupporter() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reject = useCallback(async (id: number, reason?: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.supporters.reject(id, reason);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { reject, loading, error };
}

// Bus/Transport hooks
export function useBuses(params?: any) {
  return usePaginatedApi(api.bus.getAllBuses, params);
}

export function useBus(id: string) {
  return useApi(() => api.bus.getBusById(id), [id]);
}

export function useCreateBus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.bus.createBus(data);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useUpdateBus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.bus.updateBus(id, data);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeleteBus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteBus = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.bus.deleteBus(id);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteBus, loading, error };
}

// Routes hooks
export function useRoutes(params?: any) {
  return usePaginatedApi(api.bus.getAllRoutes, params);
}

export function useRoute(id: string) {
  return useApi(() => api.bus.getRouteById(id), [id]);
}

export function useCreateRoute() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.bus.createRoute(data);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useUpdateRoute() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.bus.updateRoute(id, data);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeleteRoute() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteRoute = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.bus.deleteRoute(id);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteRoute, loading, error };
}

// Drivers hooks
export function useDrivers(params?: any) {
  return usePaginatedApi(api.bus.getAllDrivers, params);
}

export function useDriver(id: string) {
  return useApi(() => api.bus.getDriverById(id), [id]);
}

export function useCreateDriver() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.bus.createDriver(data);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useUpdateDriver() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.bus.updateDriver(id, data);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeleteDriver() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDriver = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.bus.deleteDriver(id);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteDriver, loading, error };
}

// Schedules hooks
export function useSchedules(params?: any) {
  return usePaginatedApi(api.bus.getAllSchedules, params);
}

export function useSchedule(id: string) {
  return useApi(() => api.bus.getScheduleById(id), [id]);
}

export function useCreateSchedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.bus.createSchedule(data);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useUpdateSchedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (id: string, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.bus.updateSchedule(id, data);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeleteSchedule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSchedule = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.bus.deleteSchedule(id);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteSchedule, loading, error };
}

// Funds hooks
export function useFunds(params?: any) {
  return usePaginatedApi(api.funds.getAll, params);
}

export function useFund(id: number) {
  return useApi(() => api.funds.getById(id), [id]);
}

export function useCreateFund() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.funds.create(data);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { create, loading, error };
}

export function useUpdateFund() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = useCallback(async (id: number, data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.funds.update(id, data);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { update, loading, error };
}

export function useDeleteFund() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteFund = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.funds.delete(id);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteFund, loading, error };
}

// Communication hooks
export function useMessages(params?: any) {
  return usePaginatedApi(api.communication.getAllMessages, params);
}

export function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      const result = await api.communication.sendMessage(data);
      return result;
    } catch (err) {
      const errorMessage = api.utils.handleError(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { send, loading, error };
}

// Location hooks
export function useRegions() {
  return useApi(() => api.location.getRegions(), [], true);
}

export function useDistrictsByRegion(regionId: number) {
  return useApi(() => api.location.getDistrictsByRegion(regionId), [regionId], regionId > 0);
}

export function useAllDistricts() {
  return useApi(() => api.location.getAllDistricts(), [], true);
}

export function usePollingStationsByDistrict(districtId: number) {
  return useApi(() => api.location.getPollingStationsByDistrict(districtId), [districtId], districtId > 0);
}

// Analytics hooks
export function useEventStats() {
  return useApi(() => api.events.getStats(), [], true);
}

export function useOperatorStats() {
  return useApi(() => api.operators.getAnalytics(0), [], true);
}

export function useSupporterStats() {
  return useApi(() => api.supporters.getStats(), [], true);
}

export function useBusAnalytics() {
  return useApi(() => api.bus.getAnalytics(), [], true);
}

export function useFundStats() {
  return useApi(() => api.funds.getStats(), [], true);
}

export function useCommunicationStats() {
  return useApi(() => api.communication.getStats(), [], true);
}

// Utility hooks
export function useRetry() {
  return useCallback(
    <T>(fn: () => Promise<T>, maxRetries: number = 3, delay: number = 1000) =>
      api.utils.retry(fn, maxRetries, delay),
    []
  );
}

export function useErrorHandler() {
  return useCallback((error: unknown) => api.utils.handleError(error), []);
}

export function useNetworkErrorCheck() {
  return useCallback((error: unknown) => api.utils.isNetworkError(error), []);
}

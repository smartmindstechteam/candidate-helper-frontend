'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Operator, OperatorPhone } from '@/types/operator'; // Assuming you have an operator type file
import { OperatorStatus, OperatorRole } from '@/types/enums';
import api from '@/lib/api';
import { CreateOperatorInput, EditOperatorInput } from '@/lib/validations/operator';

// --- INTERFACES ---

export interface PaginatedOperators {
  operators: Operator[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface OperatorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OperatorStatus;
  role?: OperatorRole;
  gender?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// --- API ENDPOINT ---

const OPERATORS_ENDPOINT = '/operators';

// --- REACT QUERY HOOKS ---

/**
 * Fetches a paginated list of operators.
 * @param params - Query parameters for filtering and pagination.
 */
export const useOperators = (params?: OperatorQueryParams) => {
  return useQuery<PaginatedOperators, Error>({
    queryKey: ['operators', params],
    queryFn: () =>
      api
        .get<{ success: boolean; data: PaginatedOperators }>(OPERATORS_ENDPOINT, { params })
        .then(res => res.data.data),
  });
};

/**
 * Fetches a single operator by their ID.
 * @param id - The numeric ID of the operator.
 * @param enabled - Whether the query should be enabled.
 */
export const useOperator = (id: number, enabled = true) => {
  return useQuery<{ operator: Operator }, Error>({
    queryKey: ['operator', id],
    queryFn: () =>
      api
        .get<{ success: boolean; data: { operator: Operator } }>(`${OPERATORS_ENDPOINT}/${id}`)
        .then(res => res.data.data),
    enabled: !!id && enabled,
  });
};

/**
 * Returns a mutation for creating a new operator.
 */
export const useCreateOperator = () => {
  const queryClient = useQueryClient();
  return useMutation<Operator, Error, CreateOperatorInput>({
    mutationFn: (data) =>
      api
        .post<{ success: boolean; data: Operator }>(OPERATORS_ENDPOINT, data)
        .then(res => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
    },
  });
};

/**
 * Returns a mutation for updating an existing operator.
 * @param id - The ID of the operator to update.
 */
export const useUpdateOperator = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<Operator, Error, EditOperatorInput>({
    mutationFn: (data) =>
      api
        .put<{ success: boolean; data: Operator }>(`${OPERATORS_ENDPOINT}/${id}`, data)
        .then(res => res.data.data),
    onSuccess: (_, __, context) => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      queryClient.invalidateQueries({ queryKey: ['operator', id] });
    },
  });
};

/**
 * Returns a mutation for deleting an operator.
 */
export const useDeleteOperator = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => api.delete(`${OPERATORS_ENDPOINT}/${id}`).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
    },
  });
};

/**
 * Returns a mutation to approve an operator's status.
 * @param id - The ID of the operator to approve.
 */
export const useApproveOperator = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<Operator, Error>({
    mutationFn: () => api.patch(`${OPERATORS_ENDPOINT}/${id}/approve`).then(res => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      queryClient.invalidateQueries({ queryKey: ['operator', id] });
    },
  });
};

/**
 * Returns a mutation to reject an operator's status.
 * @param id - The ID of the operator to reject.
 */
export const useRejectOperator = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<Operator, Error>({
    mutationFn: () => api.patch(`${OPERATORS_ENDPOINT}/${id}/reject`).then(res => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operators'] });
      queryClient.invalidateQueries({ queryKey: ['operator', id] });
    },
  });
};

/**
 * Fetches statistics related to operators.
 */
export const useOperatorStats = () => {
  return useQuery<any, any>({
    queryKey: ['operators', 'stats'],
    queryFn: () => api.get(`${OPERATORS_ENDPOINT}/stats`).then(res => res.data.data),
  });
};

// -------------------- Operator Phones --------------------

/**
 * Returns a mutation to add a phone number to an operator.
 * @param id - The operator's ID.
 */
export const useAddOperatorPhone = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<{ phone: OperatorPhone }, Error, Partial<OperatorPhone>>({
    mutationFn: (data) =>
      api.post(`${OPERATORS_ENDPOINT}/${id}/phones`, data).then(res => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['operator', id] }),
  });
};

/**
 * Returns a mutation to update an operator's phone number.
 * @param id - The operator's ID.
 * @param phoneId - The ID of the phone to update.
 */
export const useUpdateOperatorPhone = (id: number, phoneId: number) => {
  const queryClient = useQueryClient();
  return useMutation<{ phone: OperatorPhone }, Error, Partial<OperatorPhone>>({
    mutationFn: (data) =>
      api.put(`${OPERATORS_ENDPOINT}/${id}/phones/${phoneId}`, data).then(res => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['operator', id] }),
  });
};

/**
 * Returns a mutation to delete an operator's phone number.
 * @param id - The operator's ID.
 * @param phoneId - The ID of the phone to delete.
 */
export const useDeleteOperatorPhone = (id: number, phoneId: number) => {
  const queryClient = useQueryClient();
  return useMutation<void, Error>({
    mutationFn: () =>
      api.delete(`${OPERATORS_ENDPOINT}/${id}/phones/${phoneId}`).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['operator', id] }),
  });
};

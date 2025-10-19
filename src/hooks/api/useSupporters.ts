'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Supporter,
  SupporterPhone,
  SupporterEmergencyContact,
} from '@/types/supporter';
import { SupporterStatus } from '@/types/enums';
import api from '@/lib/api';
import { CreateSupporterInput, EditSupporterInput } from '@/lib/validations/supporter';

export interface PaginatedSupporters {
  supporters: Supporter[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface SupporterQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: SupporterStatus;
  regionId?: number;
  districtId?: number;
  gender?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

const SUPPORTERS_ENDPOINT = '/supporters';

export const useSupporters = (params?: SupporterQueryParams) => {
  return useQuery<PaginatedSupporters, any>({
    queryKey: ['supporters', params],
    queryFn: () =>
      api
        .get<{ success: boolean; data: PaginatedSupporters }>(SUPPORTERS_ENDPOINT, { params })
        .then(res => res.data.data)
  });
};

export const useSupporter = (id: number, enabled = true) => {
  return useQuery<{ supporter: Supporter }, any>({
    queryKey: ['supporter', id],
    queryFn: () =>
      api
        .get<{ success: boolean; data: { supporter: Supporter } }>(`${SUPPORTERS_ENDPOINT}/${id}`)
        .then(res => res.data.data),
    enabled: !!id && enabled,
  });
};

export const useCreateSupporter = () => {
  const queryClient = useQueryClient();
  return useMutation<{ supporter: CreateSupporterInput }, any, Partial<CreateSupporterInput>>({
    mutationFn: (data) => api.post<{ success: boolean; data: { supporter: CreateSupporterInput } }>(SUPPORTERS_ENDPOINT, data).then(res => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['supporters']}),
    onError:(error)=> console.log(error)
  });
};

export const useUpdateSupporter = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<{ supporter: EditSupporterInput }, any, EditSupporterInput>({
    mutationFn: (data) => api.put<{ success: boolean; data: { supporter: EditSupporterInput } }>(`${SUPPORTERS_ENDPOINT}/${id}`, data).then(res => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['supporters']});
      queryClient.invalidateQueries({queryKey: ['supporter', id]});
    },
  });
};

export const useDeleteSupporter = () => {
  const queryClient = useQueryClient();
  return useMutation<any, any, number>({
    mutationFn: (id) => api.delete(`${SUPPORTERS_ENDPOINT}/${id}`).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['supporters']}),
  });
};

export const useApproveSupporter = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<{ supporter: Supporter }, any>({
    mutationFn: () => api.patch(`${SUPPORTERS_ENDPOINT}/${id}/approve`).then(res => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['supporters']});
      queryClient.invalidateQueries({queryKey:['supporter', id]});
    },
  });
};

export const useRejectSupporter = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<{ supporter: Supporter }, any>({
    mutationFn: () => api.patch(`${SUPPORTERS_ENDPOINT}/${id}/reject`).then(res => res.data.data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:['supporters']});
      queryClient.invalidateQueries({queryKey:['supporter', id]});
    },
  });
};

export const useSupporterStats = () => {
  return useQuery<any, any>({
    queryKey: ['supporters', 'stats'],
    queryFn: () => api.get(`${SUPPORTERS_ENDPOINT}/stats`).then(res => res.data.data),
  });
};

// -------------------- Phones --------------------
export const useAddSupporterPhone = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<{ phone: SupporterPhone }, any, Partial<SupporterPhone>>({
    mutationFn: (data) => api.post(`${SUPPORTERS_ENDPOINT}/${id}/phones`, data).then(res => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({queryKey:['supporter', id]}),
  });
};

export const useUpdateSupporterPhone = (id: number, phoneId: number) => {
  const queryClient = useQueryClient();
  return useMutation<{ phone: SupporterPhone }, any, Partial<SupporterPhone>>({
    mutationFn: (data) => api.put(`${SUPPORTERS_ENDPOINT}/${id}/phones/${phoneId}`, data).then(res => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({queryKey:['supporter', id]}),
  });
};

export const useDeleteSupporterPhone = (id: number, phoneId: number) => {
  const queryClient = useQueryClient();
  return useMutation<any, any>({
    mutationFn: () => api.delete(`${SUPPORTERS_ENDPOINT}/${id}/phones/${phoneId}`).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({queryKey:['supporter', id]}),
  });
};

// -------------------- Emergency Contacts --------------------
export const useAddSupporterEmergencyContact = (id: number) => {
  const queryClient = useQueryClient();
  return useMutation<{ contact: SupporterEmergencyContact }, any, Partial<SupporterEmergencyContact>>({
    mutationFn: (data) => api.post(`${SUPPORTERS_ENDPOINT}/${id}/emergency-contacts`, data).then(res => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({queryKey:['supporter', id]}),
  });
};

export const useUpdateSupporterEmergencyContact = (id: number, contactId: number) => {
  const queryClient = useQueryClient();
  return useMutation<{ contact: SupporterEmergencyContact }, any, Partial<SupporterEmergencyContact>>({
    mutationFn: (data) => api.put(`${SUPPORTERS_ENDPOINT}/${id}/emergency-contacts/${contactId}`, data).then(res => res.data.data),
    onSuccess: () => queryClient.invalidateQueries({queryKey:['supporter', id]}),
  });
};

export const useDeleteSupporterEmergencyContact = (id: number, contactId: number) => {
  const queryClient = useQueryClient();
  return useMutation<any, any>({
    mutationFn: () => api.delete(`${SUPPORTERS_ENDPOINT}/${id}/emergency-contacts/${contactId}`).then(res => res.data),
    onSuccess: () => queryClient.invalidateQueries({queryKey:['supporter', id]}),
  });
};

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { Region, District, PollingStation } from '@/types/geography';

// -------------------- Regions --------------------
const REGIONS_ENDPOINT = '/geographic/regions';

export const useRegions = () => {
  return useQuery<Region[], any>({
    queryKey: ['regions'],
    queryFn: () =>
      api.get<{ success: boolean; data: { regions: Region[] } }>(REGIONS_ENDPOINT)
        .then(res => res.data.data.regions),
  });
};

export const useRegion = (id: number, enabled = true) => {
  return useQuery<{ region: Region }, any>({
    queryKey: ['region', id],
    queryFn: () =>
      api.get<{ success: boolean; data: { region: Region } }>(`${REGIONS_ENDPOINT}/${id}`)
        .then(res => res.data.data),
    enabled: !!id && enabled,
  });
};

// -------------------- Districts --------------------
const DISTRICTS_ENDPOINT = '/geographic/districts';

export const useDistricts = (regionId?: number) => {
  return useQuery<District[], any>({
    queryKey: ['districts', regionId],
    queryFn: () =>
      api.get<{ success: boolean; data: { districts: District[] } }>(DISTRICTS_ENDPOINT, {
        params: regionId ? { regionId } : {},
      }).then(res => res.data.data.districts),
  });
};

export const useDistrict = (id: number, enabled = true) => {
  return useQuery<{ district: District }, any>({
    queryKey: ['district', id],
    queryFn: () =>
      api.get<{ success: boolean; data: { district: District } }>(`${DISTRICTS_ENDPOINT}/${id}`)
        .then(res => res.data.data),
    enabled: !!id && enabled,
  });
};

// -------------------- Polling Stations --------------------
const POLLING_STATIONS_ENDPOINT = '/geographic/polling-stations';

export const usePollingStations = (districtId?: number) => {
  return useQuery<PollingStation[], any>({
    queryKey: ['pollingStations', districtId],
    queryFn: () =>
      api.get<{ success: boolean; data: { pollingStations: PollingStation[] } }>(
        POLLING_STATIONS_ENDPOINT,
        { params: districtId ? { districtId } : {} }
      ).then(res => res.data.data.pollingStations),
  });
};

export const usePollingStation = (id: number, enabled = true) => {
  return useQuery<{ pollingStation: PollingStation }, any>({
    queryKey: ['pollingStation', id],
    queryFn: () =>
      api.get<{ success: boolean; data: { pollingStation: PollingStation } }>(
        `${POLLING_STATIONS_ENDPOINT}/${id}`
      ).then(res => res.data.data),
    enabled: !!id && enabled,
  });
};

// -------------------- Stats --------------------
export const useGeographyStats = () => {
  return useQuery<any, any>({
    queryKey: ['geography', 'stats'],
    queryFn: () => api.get(`${REGIONS_ENDPOINT}/stats`).then(res => res.data.data),
  });
};

// utils/supporterTypes.ts
import { Region, District,PollingStation } from '@/types/geography';

export const supporterTypes: {
  regions: Region[];
  districts: District[];
  pollingStations: PollingStation[];
} = {
  regions: [], // fetch from API and populate dynamically
  districts: [], // fetch from API and populate dynamically
  pollingStations: [], // fetch from API and populate dynamically
};

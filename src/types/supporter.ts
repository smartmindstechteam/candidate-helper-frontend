// Supporter Module Types based on the database design

export interface Region {
  id: number;
  name: string;
  latitude?: number;
  longitude?: number;
  boundary?: GeoJSON.Polygon;
  created_at: string;
  updated_at: string;
}

export interface District {
  id: number;
  name: string;
  region_id: number;
  region?: Region;
  latitude?: number;
  longitude?: number;
  boundary?: GeoJSON.Polygon;
  created_at: string;
  updated_at: string;
}

export interface PollingStation {
  id: number;
  name: string;
  district_id: number;
  district?: District;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

export interface SupporterPhone {
  id: number;
  supporter_id: number;
  phone_number: string;
  phone_type: 'primary' | 'secondary' | 'emergency';
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupporterEmergencyContact {
  id: number;
  supporter_id: number;
  name: string;
  relationship: string;
  phone_number: string;
  email?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Supporter {
  id: number;
  firstname: string;
  middlename?: string;
  lastname: string;
  fourthname?: string;
  birthdate?: string;
  gender?: 'male' | 'female' | 'other';
  language?: string;
  special_needs?: string;
  email?: string;
  residency_address?: string;
  residency_region_id?: number;
  residency_district_id?: number;
  residency_latitude?: number;
  residency_longitude?: number;
  voting_address?: string;
  latitude?: number;
  longitude?: number;
  voter_id?: string;
  photo_verification?: string;
  fav_party?: string;
  status: 'pending' | 'approved' | 'rejected';
  pollingstation_id?: number;
  pollingstation?: PollingStation;
  district_id?: number;
  district?: District;
  region_id?: number;
  region?: Region;
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  
  // Related data
  phones?: SupporterPhone[];
  emergency_contacts?: SupporterEmergencyContact[];
}

// Form-specific types
export interface SupporterFormData {
  // Personal Information
  firstname: string;
  middlename?: string;
  lastname: string;
  fourthname?: string;
  birthdate?: string;
  gender?: 'male' | 'female' | 'other';
  language?: string;
  special_needs?: string;
  
  // Contact Information
  email?: string;
  phones: {
    phone_number: string;
    phone_type: 'primary' | 'secondary' | 'emergency';
  }[];
  
  // Emergency Contacts
  emergency_contacts: {
    name: string;
    relationship: string;
    phone_number: string;
    email?: string;
    address?: string;
  }[];
  
  // Residency Location Information
  residency_address?: string;
  residency_region_id?: number;
  residency_district_id?: number;
  residency_latitude?: number;
  residency_longitude?: number;
  
  // Voting Location Information
  voting_address?: string;
  latitude?: number;
  longitude?: number;
  region_id?: number;
  district_id?: number;
  pollingstation_id?: number;
  
  // Additional Information
  voter_id?: string;
  photo_verification?: string;
  fav_party?: string;
  
  // Terms and Conditions
  agree_to_terms: boolean;
  agree_to_data_processing: boolean;
  receive_updates: boolean;
}

// API Response types
export interface SupporterCreateRequest {
  firstname: string;
  middlename?: string;
  lastname: string;
  fourthname?: string;
  birthdate?: string;
  gender?: 'male' | 'female' | 'other';
  language?: string;
  special_needs?: string;
  email?: string;
  residency_address?: string;
  residency_region_id?: number;
  residency_district_id?: number;
  residency_latitude?: number;
  residency_longitude?: number;
  voting_address?: string;
  latitude?: number;
  longitude?: number;
  voter_id?: string;
  photo_verification?: string;
  fav_party?: string;
  pollingstation_id?: number;
  district_id?: number;
  region_id?: number;
  phones: {
    phone_number: string;
    phone_type: 'primary' | 'secondary' | 'emergency';
  }[];
  emergency_contacts: {
    name: string;
    relationship: string;
    phone_number: string;
    email?: string;
    address?: string;
  }[];
}

export interface SupporterUpdateRequest extends Partial<SupporterCreateRequest> {
  id: number;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface SupporterResponse extends Supporter {
  phones: SupporterPhone[];
  emergency_contacts: SupporterEmergencyContact[];
}

// Form validation error types
export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: FormFieldError | undefined;
}

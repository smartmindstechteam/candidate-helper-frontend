// Operator Module Types based on the database design
import { Fund } from '../lib/funds-api';

export interface OperatorPhone {
  id: number;
  operator_id: number;
  phone_number: string;
  phone_type: 'primary' | 'secondary' | 'emergency';
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface OperatorEmergencyContact {
  id: number;
  operator_id: number;
  name: string;
  relationship: string;
  phone_number: string;
  email?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_by: number;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  status: 'planned' | 'ongoing' | 'completed' | 'cancelled';
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: number;
  operator_id: number;
  action_name: string;
  entity_type: string;
  entity_id?: number;
  description?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

// Fund interface moved to funds-api.ts for consistency

export interface Operator {
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
  address?: string;
  latitude?: number;
  longitude?: number;
  role: 'operator' | 'supervisor' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  created_by?: number;
  updated_by?: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  
  // Related data
  phones?: OperatorPhone[];
  emergency_contacts?: OperatorEmergencyContact[];
  assigned_tasks?: Task[];
  assigned_supporters?: any[]; // Supporter type would be imported
  assigned_events?: Event[];
  activity_logs?: ActivityLog[];
  funds?: Fund[];
  allowed_actions?: string[];
  
  // Additional fields for data table display
  full_name?: string;
  age?: number;
  location_name?: string;
  last_activity?: string;
  task_count?: number;
  supporter_count?: number;
  event_count?: number;
  total_funds?: number;
}

// Form-specific types
export interface OperatorFormData {
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
  address?: string;
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
  
  // Location Information
  latitude?: number;
  longitude?: number;
  
  // Role and Status
  role: 'operator' | 'supervisor' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  
  // Permissions
  allowed_actions: string[];
  
  // Terms and Conditions
  agree_to_terms: boolean;
  agree_to_confidentiality: boolean;
  agree_to_background_check: boolean;
}

// API Request/Response types
export interface OperatorCreateRequest {
  firstname: string;
  middlename?: string;
  lastname: string;
  fourthname?: string;
  birthdate?: string;
  gender?: 'male' | 'female' | 'other';
  language?: string;
  special_needs?: string;
  email?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  role: 'operator' | 'supervisor' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  allowed_actions: string[];
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

export interface OperatorUpdateRequest extends Partial<OperatorCreateRequest> {
  id: number;
}

export interface OperatorResponse extends Operator {
  phones: OperatorPhone[];
  emergency_contacts: OperatorEmergencyContact[];
}

// Form validation error types
export interface OperatorFormFieldError {
  field: string;
  message: string;
}

export interface OperatorFormErrors {
  [key: string]: OperatorFormFieldError | undefined;
}

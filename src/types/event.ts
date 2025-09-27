// Event Module Types based on the database design
import { Fund } from '../lib/funds-api';

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

// Fund interface moved to funds-api.ts for consistency

export interface Operator {
  id: number;
  firstname: string;
  middlename?: string;
  lastname: string;
  fourthname?: string;
  email?: string;
  phone?: string;
  role: 'operator' | 'supervisor' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: number;
  title: string;
  type: 'rally' | 'fundraiser' | 'training' | 'meeting' | 'other';
  category: string;
  timezone: string;
  description: string;
  objective?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  start_time: string;
  end_time: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'custom';
  recurrence_rule?: Record<string, any>;
  setup_time?: string;
  teardown_time?: string;
  venue: string;
  city: string;
  district_id: number;
  region_id: number;
  address: string;
  lat?: number;
  lng?: number;
  max_capacity: number;
  expected_attendance?: number;
  actual_attendance?: number;
  budget_amount: number;
  estimated_cost?: number;
  funding_source_id?: number;
  status: 'planned' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  media_links?: string[];
  organizer_name: string;
  organizer_contact: string;
  backup_contact?: string;
  assigned_operator_id?: number;
  risk_assessment?: string;
  contingency_plan?: string;
  feedback_link?: string;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  
  // Related data
  region?: Region;
  district?: District;
  operator?: Operator;
  funding_source?: Fund;
  created_by_user?: User;
  updated_by_user?: User;
}

// Form-specific types
export interface EventFormData {
  // Basic Information
  title: string;
  type: 'rally' | 'fundraiser' | 'training' | 'meeting' | 'other';
  category: string;
  timezone: string;
  description: string;
  objective?: string;
  tags: string[];
  priority?: 'low' | 'medium' | 'high';
  
  // Date and Time
  start_time: string;
  end_time: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'custom';
  recurrence_rule?: Record<string, any>;
  setup_time?: string;
  teardown_time?: string;
  
  // Location Information
  venue: string;
  city: string;
  district_id: number;
  region_id: number;
  address: string;
  lat?: number;
  lng?: number;
  
  // Capacity and Attendance
  max_capacity: number;
  expected_attendance?: number;
  actual_attendance?: number;
  
  // Budget and Funding
  budget_amount: number;
  estimated_cost?: number;
  funding_source_id?: number;
  
  // Status and Organization
  status: 'planned' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  organizer_name: string;
  organizer_contact: string;
  backup_contact?: string;
  assigned_operator_id?: number;
  
  // Media and Links
  media_links: string[];
  feedback_link?: string;
  
  // Risk Management
  risk_assessment?: string;
  contingency_plan?: string;
}

// API Request/Response types
export interface EventCreateRequest {
  title: string;
  type: 'rally' | 'fundraiser' | 'training' | 'meeting' | 'other';
  category: string;
  timezone: string;
  description: string;
  objective?: string;
  tags?: string[];
  priority?: 'low' | 'medium' | 'high';
  start_time: string;
  end_time: string;
  recurrence: 'none' | 'daily' | 'weekly' | 'custom';
  recurrence_rule?: Record<string, any>;
  setup_time?: string;
  teardown_time?: string;
  venue: string;
  city: string;
  district_id: number;
  region_id: number;
  address: string;
  lat?: number;
  lng?: number;
  max_capacity: number;
  expected_attendance?: number;
  actual_attendance?: number;
  budget_amount: number;
  estimated_cost?: number;
  funding_source_id?: number;
  status: 'planned' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  media_links?: string[];
  organizer_name: string;
  organizer_contact: string;
  backup_contact?: string;
  assigned_operator_id?: number;
  risk_assessment?: string;
  contingency_plan?: string;
  feedback_link?: string;
}

export interface EventUpdateRequest extends Partial<EventCreateRequest> {
  id: number;
  actual_attendance?: number;
}

export interface EventResponse extends Event {
  region: Region;
  district: District;
  operator?: Operator;
  funding_source?: Fund;
  created_by_user: User;
  updated_by_user: User;
}

// Data table specific types
export interface EventTableData extends Event {
  // Computed fields for display
  duration?: string;
  attendance_rate?: number;
  budget_status?: 'under_budget' | 'over_budget' | 'on_budget';
  days_until_event?: number;
  location_display?: string;
  organizer_display?: string;
  status_display?: string;
  type_display?: string;
  priority_display?: string;
}

// Filter and search types
export interface EventFilters {
  status?: string[];
  type?: string[];
  priority?: string[];
  region_id?: number[];
  district_id?: number[];
  assigned_operator_id?: number[];
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface EventSearchParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  filters?: EventFilters;
}

// Form validation error types
export interface EventFormFieldError {
  field: string;
  message: string;
}

export interface EventFormErrors {
  [key: string]: EventFormFieldError | undefined;
}

// Event statistics types
export interface EventStats {
  total_events: number;
  planned_events: number;
  scheduled_events: number;
  in_progress_events: number;
  completed_events: number;
  cancelled_events: number;
  total_budget: number;
  total_attendance: number;
  average_attendance_rate: number;
  events_by_type: Record<string, number>;
  events_by_region: Record<string, number>;
  events_by_month: Record<string, number>;
}

// Recurrence rule types
export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  by_day?: string[];
  by_month?: number[];
  by_month_day?: number[];
  count?: number;
  until?: string;
  by_set_pos?: number[];
}

// Event export types
export interface EventExportData {
  events: EventTableData[];
  export_date: string;
  filters_applied: EventFilters;
  total_count: number;
}

// Event notification types
export interface EventNotification {
  id: number;
  event_id: number;
  type: 'reminder' | 'update' | 'cancellation' | 'completion';
  title: string;
  message: string;
  scheduled_for: string;
  sent_at?: string;
  created_at: string;
}

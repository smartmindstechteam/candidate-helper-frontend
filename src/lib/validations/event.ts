import { z } from "zod";

// Event validation schemas based on the database design

export const eventCreateSchema = z.object({
  // Basic Information
  title: z.string()
    .min(5, "Event title must be at least 5 characters")
    .max(255, "Event title must not exceed 255 characters"),
  
  type: z.enum(['rally', 'fundraiser', 'training', 'meeting', 'other']),
  
  category: z.string()
    .min(1, "Category is required")
    .max(100, "Category must not exceed 100 characters"),
  
  timezone: z.string()
    .min(1, "Timezone is required")
    .max(100, "Timezone must not exceed 100 characters"),
  
  description: z.string()
    .min(20, "Description must be at least 20 characters")
    .max(5000, "Description must not exceed 5000 characters"),
  
  objective: z.string()
    .max(5000, "Objective must not exceed 5000 characters")
    .optional(),
  
  tags: z.array(z.string())
    .max(10, "Maximum 10 tags allowed")
    .optional(),
  
  priority: z.enum(['low', 'medium', 'high']).optional(),
  
  // Date and Time
  start_time: z.string()
    .min(1, "Start time is required")
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid start time format"
    }),
  
  end_time: z.string()
    .min(1, "End time is required")
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid end time format"
    }),
  
  recurrence: z.enum(['none', 'daily', 'weekly', 'custom']),
  
  recurrence_rule: z.record(z.string(), z.any()).optional(),
  
  setup_time: z.string()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid setup time format"
    })
    .optional(),
  
  teardown_time: z.string()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid teardown time format"
    })
    .optional(),
  
  // Location Information
  venue: z.string()
    .min(3, "Venue name must be at least 3 characters")
    .max(255, "Venue name must not exceed 255 characters"),
  
  city: z.string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must not exceed 100 characters"),
  
  district_id: z.number()
    .int("District ID must be an integer")
    .positive("District ID must be positive"),
  
  region_id: z.number()
    .int("Region ID must be an integer")
    .positive("Region ID must be positive"),
  
  address: z.string()
    .min(10, "Address must be at least 10 characters")
    .max(255, "Address must not exceed 255 characters"),
  
  lat: z.number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90")
    .optional(),
  
  lng: z.number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180")
    .optional(),
  
  // Capacity and Attendance
  max_capacity: z.number()
    .int("Maximum capacity must be an integer")
    .min(1, "Maximum capacity must be at least 1")
    .max(100000, "Maximum capacity must not exceed 100,000"),
  
  expected_attendance: z.number()
    .int("Expected attendance must be an integer")
    .min(0, "Expected attendance cannot be negative")
    .max(100000, "Expected attendance must not exceed 100,000")
    .optional(),
  
  actual_attendance: z.number()
    .int("Actual attendance must be an integer")
    .min(0, "Actual attendance cannot be negative")
    .max(100000, "Actual attendance must not exceed 100,000")
    .optional(),
  
  // Budget and Funding
  budget_amount: z.number()
    .min(0, "Budget amount cannot be negative")
    .max(999999999.99, "Budget amount must not exceed 999,999,999.99"),
  
  estimated_cost: z.number()
    .min(0, "Estimated cost cannot be negative")
    .max(999999999.99, "Estimated cost must not exceed 999,999,999.99")
    .optional(),
  
  funding_source_id: z.number()
    .int("Funding source ID must be an integer")
    .positive("Funding source ID must be positive")
    .optional(),
  
  // Status and Organization
  status: z.enum(['planned', 'scheduled', 'in_progress', 'completed', 'cancelled']),
  
  organizer_name: z.string()
    .min(2, "Organizer name must be at least 2 characters")
    .max(150, "Organizer name must not exceed 150 characters"),
  
  organizer_contact: z.string()
    .min(10, "Organizer contact must be at least 10 characters")
    .max(50, "Organizer contact must not exceed 50 characters")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format"),
  
  backup_contact: z.string()
    .min(10, "Backup contact must be at least 10 characters")
    .max(50, "Backup contact must not exceed 50 characters")
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format")
    .optional(),
  
  assigned_operator_id: z.number()
    .int("Assigned operator ID must be an integer")
    .positive("Assigned operator ID must be positive")
    .optional(),
  
  // Media and Links
  media_links: z.array(z.string().url("Invalid media link URL"))
    .max(10, "Maximum 10 media links allowed")
    .optional(),
  
  feedback_link: z.string()
    .url("Invalid feedback link URL")
    .max(255, "Feedback link must not exceed 255 characters")
    .optional(),
  
  // Risk Management
  risk_assessment: z.string()
    .max(5000, "Risk assessment must not exceed 5000 characters")
    .optional(),
  
  contingency_plan: z.string()
    .max(5000, "Contingency plan must not exceed 5000 characters")
    .optional(),
}).refine((data) => {
  // Validate that end_time is after start_time
  const startTime = new Date(data.start_time);
  const endTime = new Date(data.end_time);
  return endTime > startTime;
}, {
  message: "End time must be after start time",
  path: ["end_time"]
}).refine((data) => {
  // Validate that expected_attendance doesn't exceed max_capacity
  if (data.expected_attendance && data.expected_attendance > data.max_capacity) {
    return false;
  }
  return true;
}, {
  message: "Expected attendance cannot exceed maximum capacity",
  path: ["expected_attendance"]
}).refine((data) => {
  // Validate that actual_attendance doesn't exceed max_capacity
  if (data.actual_attendance && data.actual_attendance > data.max_capacity) {
    return false;
  }
  return true;
}, {
  message: "Actual attendance cannot exceed maximum capacity",
  path: ["actual_attendance"]
});

export const eventUpdateSchema = eventCreateSchema.partial().extend({
  id: z.number().int().positive("Event ID is required and must be positive")
});

export const eventFormSchema = eventCreateSchema;

// Validation schemas for specific operations
export const eventStatusUpdateSchema = z.object({
  id: z.number().int().positive("Event ID is required"),
  status: z.enum(['planned', 'scheduled', 'in_progress', 'completed', 'cancelled'])
});

export const eventAttendanceUpdateSchema = z.object({
  id: z.number().int().positive("Event ID is required"),
  actual_attendance: z.number()
    .int("Actual attendance must be an integer")
    .min(0, "Actual attendance cannot be negative")
    .max(100000, "Actual attendance must not exceed 100,000")
});

export const eventBudgetUpdateSchema = z.object({
  id: z.number().int().positive("Event ID is required"),
  budget_amount: z.number()
    .min(0, "Budget amount cannot be negative")
    .max(999999999.99, "Budget amount must not exceed 999,999,999.99"),
  estimated_cost: z.number()
    .min(0, "Estimated cost cannot be negative")
    .max(999999999.99, "Estimated cost must not exceed 999,999,999.99")
    .optional()
});

// Search and filter validation schemas
export const eventSearchSchema = z.object({
  search: z.string().max(255, "Search term must not exceed 255 characters").optional(),
  status: z.array(z.enum(['planned', 'scheduled', 'in_progress', 'completed', 'cancelled'])).optional(),
  type: z.array(z.enum(['rally', 'fundraiser', 'training', 'meeting', 'other'])).optional(),
  priority: z.array(z.enum(['low', 'medium', 'high'])).optional(),
  region_id: z.array(z.number().int().positive()).optional(),
  district_id: z.array(z.number().int().positive()).optional(),
  assigned_operator_id: z.array(z.number().int().positive()).optional(),
  date_from: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }).optional(),
  date_to: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format"
  }).optional(),
  page: z.number().int().min(1, "Page must be at least 1").default(1),
  limit: z.number().int().min(1, "Limit must be at least 1").max(100, "Limit must not exceed 100").default(15),
  sort_by: z.string().max(50, "Sort field must not exceed 50 characters").optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc')
});

// Recurrence rule validation
export const recurrenceRuleSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  interval: z.number().int().min(1, "Interval must be at least 1").max(365, "Interval must not exceed 365"),
  by_day: z.array(z.string()).optional(),
  by_month: z.array(z.number().int().min(1).max(12)).optional(),
  by_month_day: z.array(z.number().int().min(1).max(31)).optional(),
  count: z.number().int().min(1).max(999).optional(),
  until: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid until date format"
  }).optional(),
  by_set_pos: z.array(z.number().int().min(-53).max(53)).optional()
});

// Export types
export type EventCreateInput = z.infer<typeof eventCreateSchema>;
export type EventUpdateInput = z.infer<typeof eventUpdateSchema>;
export type EventFormInput = z.infer<typeof eventFormSchema>;
export type EventStatusUpdateInput = z.infer<typeof eventStatusUpdateSchema>;
export type EventAttendanceUpdateInput = z.infer<typeof eventAttendanceUpdateSchema>;
export type EventBudgetUpdateInput = z.infer<typeof eventBudgetUpdateSchema>;
export type EventSearchInput = z.infer<typeof eventSearchSchema>;
export type RecurrenceRuleInput = z.infer<typeof recurrenceRuleSchema>;

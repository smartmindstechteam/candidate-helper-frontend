import { z } from 'zod';
import { SupporterFormData } from '../../types/supporter';

// Phone validation schema
const phoneSchema = z.object({
  phone_number: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Please enter a valid phone number'),
  phone_type: z.enum(['primary', 'secondary', 'emergency'], {
    message: 'Phone type is required',
  }),
});

// Emergency contact validation schema
const emergencyContactSchema = z.object({
  name: z
    .string()
    .min(2, 'Emergency contact name must be at least 2 characters')
    .max(100, 'Emergency contact name must be less than 100 characters'),
  relationship: z
    .string()
    .min(2, 'Relationship must be at least 2 characters')
    .max(50, 'Relationship must be less than 50 characters'),
  phone_number: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Please enter a valid phone number'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(200, 'Address must be less than 200 characters')
    .optional()
    .or(z.literal('')),
});

// Main supporter registration schema
export const supporterRegistrationSchema = z.object({
  // Personal Information
  firstname: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, 'First name can only contain letters and spaces'),
  middlename: z
    .string()
    .max(50, 'Middle name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\u0600-\u06FF]*$/, 'Middle name can only contain letters and spaces')
    .optional()
    .or(z.literal('')),
  lastname: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\u0600-\u06FF]+$/, 'Last name can only contain letters and spaces'),
  fourthname: z
    .string()
    .max(50, 'Fourth name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\u0600-\u06FF]*$/, 'Fourth name can only contain letters and spaces')
    .optional()
    .or(z.literal('')),
  birthdate: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const parsedDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - parsedDate.getFullYear();
        return age >= 16 && age <= 120;
      },
      {
        message: 'Age must be between 16 and 120 years',
      }
    ),
  gender: z.enum(['male', 'female', 'other']).optional(),
  language: z
    .string()
    .max(50, 'Language must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  special_needs: z
    .string()
    .max(500, 'Special needs description must be less than 500 characters')
    .optional()
    .or(z.literal('')),

  // Contact Information
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),

  // Phone numbers (at least one primary phone required)
  phones: z
    .array(phoneSchema)
    .min(1, 'At least one phone number is required')
    .refine(
      (phones) => phones.some((phone) => phone.phone_type === 'primary'),
      {
        message: 'At least one primary phone number is required',
      }
    ),

  // Emergency contacts (at least one required)
  emergency_contacts: z
    .array(emergencyContactSchema)
    .min(1, 'At least one emergency contact is required')
    .max(3, 'Maximum 3 emergency contacts allowed'),

  // Residency Location Information
  residency_address: z
    .string()
    .max(200, 'Residency address must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  residency_region_id: z
    .number()
    .positive('Please select a residency region')
    .optional(),
  residency_district_id: z
    .number()
    .positive('Please select a residency district')
    .optional(),
  residency_latitude: z
    .number()
    .min(-90, 'Invalid residency latitude')
    .max(90, 'Invalid residency latitude')
    .optional(),
  residency_longitude: z
    .number()
    .min(-180, 'Invalid residency longitude')
    .max(180, 'Invalid residency longitude')
    .optional(),

  // Voting Location Information
  voting_address: z
    .string()
    .max(200, 'Voting address must be less than 200 characters')
    .optional()
    .or(z.literal('')),
  latitude: z
    .number()
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude')
    .optional(),
  longitude: z
    .number()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude')
    .optional(),
  region_id: z
    .number()
    .positive('Please select a voting region')
    .optional(),
  district_id: z
    .number()
    .positive('Please select a voting district')
    .optional(),
  pollingstation_id: z
    .number()
    .positive('Please select a polling station')
    .optional(),

  // Additional Information
  voter_id: z
    .string()
    .max(50, 'Voter ID must be less than 50 characters')
    .optional()
    .or(z.literal('')),
  photo_verification: z
    .string()
    .url('Please provide a valid photo URL')
    .optional()
    .or(z.literal('')),
  fav_party: z
    .string()
    .max(100, 'Favorite party must be less than 100 characters')
    .optional()
    .or(z.literal('')),

  // Terms and Conditions
  agree_to_terms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  agree_to_data_processing: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must agree to data processing',
    }),
  receive_updates: z.boolean(),
});

// Type inference from schema
export type SupporterRegistrationFormData = z.infer<typeof supporterRegistrationSchema>;

// Validation schemas for individual sections
export const personalInfoSchema = supporterRegistrationSchema.pick({
  firstname: true,
  middlename: true,
  lastname: true,
  fourthname: true,
  birthdate: true,
  gender: true,
  language: true,
  special_needs: true,
});

export const contactInfoSchema = supporterRegistrationSchema.pick({
  email: true,
  address: true,
  phones: true,
  emergency_contacts: true,
});

export const locationInfoSchema = supporterRegistrationSchema.pick({
  latitude: true,
  longitude: true,
  region_id: true,
  district_id: true,
  pollingstation_id: true,
});

export const additionalInfoSchema = supporterRegistrationSchema.pick({
  voter_id: true,
  photo_verification: true,
  fav_party: true,
});

export const termsSchema = supporterRegistrationSchema.pick({
  agree_to_terms: true,
  agree_to_data_processing: true,
  receive_updates: true,
});

// Helper functions for validation
export const validateSupporterForm = (data: unknown): SupporterFormData => {
  return supporterRegistrationSchema.parse(data);
};

export const validateSupporterFormSafe = (data: unknown) => {
  return supporterRegistrationSchema.safeParse(data);
};

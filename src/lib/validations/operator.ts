import { z } from 'zod';
import { OperatorFormData } from '../../types/operator';

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

// Main operator registration schema
export const operatorRegistrationSchema = z.object({
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
        return age >= 18 && age <= 120;
      },
      {
        message: 'Age must be between 18 and 120 years',
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
  address: z
    .string()
    .max(200, 'Address must be less than 200 characters')
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

  // Location Information
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

  // Role and Status
  role: z.enum(['operator', 'supervisor', 'admin'], {
    message: 'Please select a role',
  }),
  status: z.enum(['pending', 'approved', 'rejected'], {
    message: 'Please select a status',
  }),

  // Permissions
  allowed_actions: z
    .array(z.string())
    .min(1, 'At least one action permission is required'),

  // Terms and Conditions
  agree_to_terms: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must agree to the terms and conditions',
    }),
  agree_to_confidentiality: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must agree to confidentiality agreement',
    }),
  agree_to_background_check: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must agree to background check',
    }),
});

// Type inference from schema
export type OperatorRegistrationFormData = z.infer<typeof operatorRegistrationSchema>;

// Validation schemas for individual sections
export const personalInfoSchema = operatorRegistrationSchema.pick({
  firstname: true,
  middlename: true,
  lastname: true,
  fourthname: true,
  birthdate: true,
  gender: true,
  language: true,
  special_needs: true,
});

export const contactInfoSchema = operatorRegistrationSchema.pick({
  email: true,
  address: true,
  phones: true,
  emergency_contacts: true,
});

export const locationInfoSchema = operatorRegistrationSchema.pick({
  latitude: true,
  longitude: true,
});

export const roleInfoSchema = operatorRegistrationSchema.pick({
  role: true,
  status: true,
  allowed_actions: true,
});

export const termsSchema = operatorRegistrationSchema.pick({
  agree_to_terms: true,
  agree_to_confidentiality: true,
  agree_to_background_check: true,
});

// Helper functions for validation
export const validateOperatorForm = (data: unknown): OperatorFormData => {
  return operatorRegistrationSchema.parse(data);
};

export const validateOperatorFormSafe = (data: unknown) => {
  return operatorRegistrationSchema.safeParse(data);
};

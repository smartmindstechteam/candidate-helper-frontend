import { z } from "zod";
import { OperatorRole, OperatorStatus, Gender } from "@/types/enums"; // Assuming these enums exist
import { languageEnum } from "./supporter";

// --- HELPER SCHEMAS & CONSTANTS ---

// A simple regex for Somali phone numbers. Adjust if needed.

// Schema for a single phone number entry
// *** KEY CHANGE: isPrimary is now OPTIONAL, matching the expected resolver type ***
const phoneSchema = z.object({
  type: z.enum(["primary", "secondary"]),
  phone: z
  .string()
  .min(5, "Phone number too short")
  .max(20, "Phone number too long")
  .regex(/^[0-9+]+$/, "Phone number must contain only digits or +"),
});

// --- BASE OPERATOR SCHEMA ---

const operatorBaseSchema = z.object({
  // --- Names ---
  firstname: z
    .string()
    .min(2, { message: "First name must be at least 2 characters long" }),
  middlename: z.string().min(2, "Middle name must be at least 2 characters long").optional(),
  lastname: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters long" }),
  fourthname: z.string().optional(),

  // --- Core Details ---
    birthdate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),

  gender: z.enum(Gender, {
    error: () => ({ message: "Please select a valid gender" }),
  }),

  email: z
    .string()
    .email({ message: "Please enter a valid email address" }).optional(), 

  address: z.string().optional(),
  // Assuming a separate language enum for operators
  language: languageEnum,
  specialNeeds: z.string().optional(),

  // --- Operator Specifics ---
  role: z.enum(OperatorRole, {
    error: () => ({ message: "Please select a valid role" }),
  }),

  status: z.enum(OperatorStatus, {
    error: () => ({ message: "Please select a valid status" }),
  }),

  // --- Phones (with Primary Check) ---
    phones: z.array(phoneSchema).min(1, "At least one phone number is required").max(2, "No more than 2 phone numbers allowed"),
  
});

// -----------------------------------------

// --- CREATE OPERATOR SCHEMA ---

export const createOperatorSchema = operatorBaseSchema.extend({
  email: z.string().email({ message: "A valid email is required to create an operator" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),

  passwordConfirmation: z
    .string()
    .min(8, { message: "Password confirmation is required" }),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords do not match",
  path: ["passwordConfirmation"],
});

// -----------------------------------------

// --- EDIT OPERATOR SCHEMAS ---

// Uses partial() like your supporter schema for flexible editing


// 2. Schema for the database (excludes password confirmation)
export const createOperatorDbSchema = createOperatorSchema.omit({
  passwordConfirmation: true, 
  password:true,
});
export const editOperatorSchema = createOperatorDbSchema.partial(); 

// --- TYPE INFERENCE ---

export type CreateOperatorInput = z.infer<typeof createOperatorDbSchema>;
export type EditOperatorInput = z.infer<typeof editOperatorSchema>;
export type CreateOperatorDbInput = z.infer<typeof createOperatorDbSchema>;
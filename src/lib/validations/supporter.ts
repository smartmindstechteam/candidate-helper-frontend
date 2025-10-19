import { Gender, SupporterStatus } from "@/types/enums";
import { email, z } from "zod";

// Basic reusable enums/options
const statusEnum = z.enum(["approved", "pending", "rejected"]);
const genderEnum = z.enum(["m", "f"]);
export const languageEnum = z.enum(["english", "somali", "arabic"]); // add more as needed

// Phone schema
const phoneSchema = z.object({
  type: z.enum(["primary", "secondary"]),
  phone: z
  .string()
  .min(5, "Phone number too short")
  .max(20, "Phone number too long")
  .regex(/^[0-9+]+$/, "Phone number must contain only digits or +"),
});
const emergencyContactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  relationship: z.string().min(1, "Relationship is required"),
  phone: z.string().refine((val) => /^[0-9+]+$/.test(val) && val.length >= 7 && val.length <= 20, {
    message: "Invalid phone number",
  }),
  email: z.string().email("Invalid email address").optional(),
})

// Supporter creation schema
export const createSupporterSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  middlename: z.string().min(1, "Middle name is required"),
  lastname: z.string().min(1, "Last name is required"),
  fourthname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").optional(),
  gender: z.enum(Gender),
  birthdate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  language: languageEnum,
  phones: z.array(phoneSchema).min(1, "At least one phone number is required").max(2, "No more than 2 phone numbers allowed"),
  emergencyContacts: z.array(emergencyContactSchema).min(1, "At least one emergency contact is required").max(3, "No more than 3 emergency contacts allowed").optional(),
  status: z.enum(SupporterStatus), // Defaults to "pending"
  favParty: z.string().optional(),
  specialNeeds: z.string().optional(),
  address: z.string().optional(),
  regionId: z.number().int().optional(),
  districtId: z.number().int().optional(),
  pollingStationId: z.number().int().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  voterId: z.string().optional(),
  photoVerification: z.string().url().optional(),
});

// Supporter editing schema
export const editSupporterSchema = createSupporterSchema.partial({
    firstname: true,
    middlename: true,
    lastname: true,
    email: true,
});

export type CreateSupporterInput = z.infer<typeof createSupporterSchema>;
export type EditSupporterInput = z.infer<typeof editSupporterSchema>;

// Example usage
// import { createSupporterSchema } from "./schemas/supporter";
// const parsed = createSupporterSchema.parse(req.body);

import { z } from "zod";

const phoneRegex = /^[6-9]\d{9}$/;

export const enquirySchema = z.object({
  applicantName: z
    .string()
    .trim()
    .min(2, "Please enter a sample applicant name (at least 2 characters).")
    .max(80, "Name is too long."),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Enter a 10-digit sample Indian mobile number (starting with 6–9)."),
  email: z
    .string()
    .trim()
    .email("Enter a valid sample email address.")
    .optional()
    .or(z.literal("")),
  interestedCourseId: z.string().min(1, "Please select an interested course."),
  preferredBatch: z.string().min(1, "Please select a preferred batch timing."),
  message: z.string().trim().max(400, "Message must be under 400 characters.").optional().or(z.literal("")),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;

export const studentRegistrationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name is required (minimum 2 characters).")
    .max(80, "Full name is too long."),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Enter a 10-digit sample contact number (starting with 6–9)."),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .optional()
    .or(z.literal("")),
  guardianName: z
    .string()
    .trim()
    .min(2, "Guardian name is required.")
    .max(80, "Guardian name is too long."),
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  address: z.string().trim().min(4, "Please enter a sample locality/address.").max(200, "Address is too long."),
  courseId: z.string().min(1, "Please select a course."),
  batchId: z.string().min(1, "Please select a batch."),
  admissionDate: z.string().min(1, "Admission date is required."),
  totalFee: z.coerce.number().min(100, "Course fee must be at least ₹100.").max(500000, "Invalid fee amount."),
  initialPayment: z.coerce.number().min(0, "Initial payment cannot be negative."),
  paymentMethod: z.enum(["Cash", "UPI", "Bank Transfer"]).default("Cash"),
  status: z.enum(["Active", "Completed", "On Leave", "Dropped"]).default("Active"),
  notes: z.string().trim().max(300).optional().or(z.literal("")),
}).refine((data) => data.initialPayment <= data.totalFee, {
  message: "Initial payment cannot exceed total course fees.",
  path: ["initialPayment"],
});

export type StudentRegistrationValues = z.infer<typeof studentRegistrationSchema>;

export const studentEditSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required.").max(80),
  phone: z.string().trim().regex(phoneRegex, "Enter a valid 10-digit sample contact number."),
  email: z.string().trim().email("Enter a valid email address.").optional().or(z.literal("")),
  guardianName: z.string().trim().min(2, "Guardian name is required.").max(80),
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  address: z.string().trim().min(4, "Address is required.").max(200),
  courseId: z.string().min(1, "Course is required."),
  batchId: z.string().min(1, "Batch is required."),
  status: z.enum(["Active", "Completed", "On Leave", "Dropped"]),
  notes: z.string().trim().max(300).optional().or(z.literal("")),
});

export type StudentEditValues = z.infer<typeof studentEditSchema>;

export const collectPaymentSchema = z.object({
  studentId: z.string().min(1, "Please select a student."),
  amount: z.coerce.number().positive("Payment amount must be greater than ₹0."),
  method: z.enum(["Cash", "UPI", "Bank Transfer"]),
  paymentDate: z.string().min(1, "Payment date is required."),
  reference: z.string().trim().max(60, "Reference must be under 60 characters.").optional().or(z.literal("")),
  notes: z.string().trim().max(200, "Notes must be under 200 characters.").optional().or(z.literal("")),
});

export type CollectPaymentValues = z.infer<typeof collectPaymentSchema>;

export const courseSchema = z.object({
  code: z.string().trim().min(2, "Course code is required.").max(12),
  name: z.string().trim().min(3, "Course name is required.").max(80),
  category: z.enum(["Basic & Office", "Accounting", "Design & DTP", "Programming", "Diploma"]),
  duration: z.string().trim().min(2, "Duration label is required (e.g. 6 Months)."),
  durationMonths: z.coerce.number().int().min(1).max(36),
  fee: z.coerce.number().min(100, "Fee must be at least ₹100."),
  description: z.string().trim().min(10, "Short description is required.").max(260),
  highlights: z.string().trim().optional(),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

export const batchSchema = z.object({
  name: z.string().trim().min(2, "Batch name is required.").max(60),
  courseId: z.string().min(1, "Select a course."),
  timing: z.string().trim().min(3, "Batch timing is required (e.g. 08:00 AM – 09:30 AM)."),
  days: z.string().trim().min(3, "Batch days are required (e.g. Mon, Wed, Fri)."),
  instructor: z.string().trim().min(2, "Instructor name is required.").max(60),
  capacity: z.coerce.number().int().min(1).max(100),
});

export type BatchFormValues = z.infer<typeof batchSchema>;

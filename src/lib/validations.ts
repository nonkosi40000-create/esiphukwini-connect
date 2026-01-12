import { z } from 'zod';

// Validate SA ID number (13 digits)
const saIdNumberSchema = z.string()
  .length(13, 'ID number must be exactly 13 digits')
  .regex(/^\d+$/, 'ID number must contain only digits');

// Validate SA phone number (+27 or 0, followed by 9 digits)
const saPhoneSchema = z.string()
  .refine((val) => {
    const cleaned = val.replace(/\s/g, '');
    return /^(\+27|0)\d{9}$/.test(cleaned);
  }, 'Phone number must be 10 digits starting with 0 or +27');

// Validate email must have @gmail.com (as per requirements)
const emailSchema = z.string()
  .email('Please enter a valid email address')
  .regex(/@gmail\.com$/i, 'Email must be a Gmail address (@gmail.com)');

// Validate age corresponds to ID number
const validateAgeWithId = (age: number, idNumber: string): boolean => {
  if (idNumber.length !== 13) return false;
  
  const birthYearPrefix = parseInt(idNumber.substring(0, 2));
  const currentYear = new Date().getFullYear();
  const currentYearShort = currentYear % 100;
  
  // Determine full birth year
  let birthYear: number;
  if (birthYearPrefix <= currentYearShort) {
    birthYear = 2000 + birthYearPrefix;
  } else {
    birthYear = 1900 + birthYearPrefix;
  }
  
  const calculatedAge = currentYear - birthYear;
  return Math.abs(calculatedAge - age) <= 1; // Allow 1 year difference for birthday timing
};

// Learner registration schema
export const learnerRegistrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phoneNumber: saPhoneSchema,
  identityNumber: saIdNumberSchema,
  age: z.number().min(4, 'Minimum age is 4').max(15, 'Maximum age is 15'),
  physicalAddress: z.string().min(10, 'Please enter a complete address'),
  previousGrade: z.enum(['R', '1', '2', '3', '4', '5', '6', '7']).optional(),
  applyingForGrade: z.enum(['R', '1', '2', '3', '4', '5', '6', '7']),
  parentGuardianName: z.string().min(2, 'Guardian name is required'),
  parentGuardianPhone: saPhoneSchema,
  parentGuardianEmail: emailSchema.optional().or(z.literal('')),
  nextOfKinContact: saPhoneSchema.optional().or(z.literal('')),
  backupEmail: z.string().email().optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => validateAgeWithId(data.age, data.identityNumber), {
  message: "Age does not match the ID number",
  path: ["age"],
});

// Staff registration schema
export const staffRegistrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  phoneNumber: saPhoneSchema,
  identityNumber: saIdNumberSchema,
  age: z.number().min(21, 'Minimum age for staff is 21').max(70, 'Maximum age is 70'),
  physicalAddress: z.string().min(10, 'Please enter a complete address'),
  role: z.enum(['teacher', 'grade_head', 'principal', 'admin']),
  gradesTeaching: z.array(z.enum(['R', '1', '2', '3', '4', '5', '6', '7'])).optional(),
  subjectsTeaching: z.array(z.string()).optional(),
  nextOfKinContact: saPhoneSchema,
  backupEmail: z.string().email().optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => validateAgeWithId(data.age, data.identityNumber), {
  message: "Age does not match the ID number",
  path: ["age"],
});

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LearnerRegistrationData = z.infer<typeof learnerRegistrationSchema>;
export type StaffRegistrationData = z.infer<typeof staffRegistrationSchema>;
export type LoginData = z.infer<typeof loginSchema>;

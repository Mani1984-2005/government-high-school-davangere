import { z } from 'zod';
import { REGISTRATION_POLICY } from '../../../shared/constants/authPolicy.ts';
import { normalizeIndianMobileE164 } from '../../utils/crypto.ts';

export function detectForbiddenFields(rawBody: unknown): string[] {
  if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
    return [];
  }
  const keys = Object.keys(rawBody as Record<string, unknown>);
  const forbiddenLower = new Set(
    REGISTRATION_POLICY.forbiddenRequestFields.map((field) => field.toLowerCase())
  );
  return keys.filter((key) => forbiddenLower.has(key.toLowerCase()));
}

const indianMobileSchema = z
  .string()
  .trim()
  .transform((val, ctx) => {
    const normalized = normalizeIndianMobileE164(val);
    if (!normalized) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Provide a valid 10-digit Indian mobile number (with or without +91).',
      });
      return z.NEVER;
    }
    return normalized;
  });

const optionalEmailSchema = z
  .string()
  .trim()
  .email('Provide a valid email address.')
  .max(160)
  .optional()
  .or(z.literal('').transform(() => undefined));

const academicYearSchema = z
  .string()
  .trim()
  .regex(/^20\d{2}-(\d{2}|20\d{2})$/, 'Academic year must follow YYYY-YY format (e.g. 2025-26).');

const optionalSectionSchema = z
  .string()
  .trim()
  .regex(/^[A-Za-z0-9]{1,8}$/, 'Section may contain up to 8 alphanumeric characters.')
  .optional()
  .or(z.literal('').transform(() => undefined));

export const studentRegistrationSchema = z
  .object({
    studentName: z.string().trim().min(2, 'Student full name is required.').max(120),
    studentIdentifier: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9_-]{4,32}$/, 'Student ID must be 4-32 alphanumeric characters.')
      .optional()
      .or(z.literal('').transform(() => undefined)),
    satsRef: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9_-]{6,32}$/, 'SATS identifier must be 6-32 alphanumeric characters.')
      .optional()
      .or(z.literal('').transform(() => undefined)),
    classGrade: z.union([z.literal(8), z.literal(9), z.literal(10)]),
    section: optionalSectionSchema,
    academicYear: academicYearSchema,
    mobileNumber: indianMobileSchema,
    email: optionalEmailSchema,
    guardianName: z.string().trim().min(2, 'Parent/guardian name is required.').max(120),
    guardianRelationship: z.enum(['mother', 'father', 'legal_guardian']),
    guardianMobileNumber: indianMobileSchema,
    guardianEmail: optionalEmailSchema,
    minorGuardianConsent: z
      .boolean()
      .refine((val) => val === true, 'Guardian participation and consent confirmation is required.'),
  })
  .strict();

export const parentRegistrationSchema = z
  .object({
    guardianName: z.string().trim().min(2, 'Parent/guardian full name is required.').max(120),
    relationship: z.enum(['mother', 'father', 'legal_guardian']),
    guardianMobileNumber: indianMobileSchema,
    guardianEmail: optionalEmailSchema,
    studentIdentifier: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9_-]{4,32}$/, 'Student ID or SATS reference is required.'),
    studentName: z.string().trim().min(2, 'Student full name is required.').max(120),
    classGrade: z.union([z.literal(8), z.literal(9), z.literal(10)]),
    academicYear: academicYearSchema,
  })
  .strict();

export const staffRegistrationSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Staff full name is required.').max(120),
    officialStaffId: z
      .string()
      .trim()
      .regex(/^[A-Za-z0-9_-]{4,32}$/, 'Official Staff ID must be 4-32 alphanumeric characters.'),
    designation: z.string().trim().min(2, 'Official designation is required.').max(80),
    departmentOrSubject: z.string().trim().min(2, 'Department or subject is required.').max(80),
    mobileNumber: indianMobileSchema,
    email: z.string().trim().email('Valid official email address is required.').max(160),
  })
  .strict();

export const registrationStatusSchema = z
  .object({
    referenceCode: z
      .string()
      .trim()
      .toUpperCase()
      .regex(/^GHS-REG-\d{4}-[A-F0-9]{8}$/, 'Invalid registration reference format.'),
    identifier: z.string().trim().min(4, 'Provide matching ID or mobile number.').max(120),
  })
  .strict();

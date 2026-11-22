export const OTP_POLICY = {
  length: 6,
  ttlSeconds: 5 * 60,
  maxAttempts: 5,
  resendCooldownSeconds: 60,
  emailTokenTtlSeconds: 24 * 60 * 60,
} as const;

export const REGISTRATION_POLICY = {
  allowedGrades: [8, 9, 10] as const,
  minAcademicYearStart: 2024,
  maxAcademicYearStart: 2030,
  // Explicitly reject Aadhaar or client-assigned role/status fields at input boundaries
  forbiddenRequestFields: [
    'aadhaar',
    'aadhar',
    'aadhaarNumber',
    'aadharNumber',
    'uidai',
    'role',
    'roles',
    'accountStatus',
    'status',
    'isApproved',
    'permissions',
  ] as const,
} as const;

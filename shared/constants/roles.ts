export const RBAC_ROLES = [
  'STUDENT',
  'PARENT_GUARDIAN',
  'TEACHER',
  'HEADMASTER',
  'SCHOOL_ADMIN',
  'DATA_ENTRY_OPERATOR',
  'AUDITOR',
] as const;

export type RbacRoleCode = (typeof RBAC_ROLES)[number];

export const REGISTRATION_STATUSES = [
  'draft',
  'pending_contact_verification',
  'pending_school_approval',
  'approved',
  'rejected',
  'suspended',
  'revoked',
] as const;

export type RegistrationStatus = (typeof REGISTRATION_STATUSES)[number];

export const GUARDIAN_VERIFICATION_STATUSES = [
  'pending',
  'approved',
  'rejected',
  'revoked',
] as const;

export type GuardianVerificationStatus = (typeof GUARDIAN_VERIFICATION_STATUSES)[number];

export const PRIVILEGED_ROLES: readonly RbacRoleCode[] = [
  'TEACHER',
  'HEADMASTER',
  'SCHOOL_ADMIN',
  'DATA_ENTRY_OPERATOR',
  'AUDITOR',
];

export const PERMISSION_CODES = [
  'profile:read:own',
  'student:academics:read:own',
  'student:attendance:read:own',
  'student:results:read:own',
  'materials:read',
  'materials:publish',
  'notices:read',
  'notices:manage',
  'welfare:read',
  'parent:children:read:linked',
  'parent:contact:update:own',
  'staff:classes:read:assigned',
  'staff:students:read:assigned',
  'staff:attendance:submit:assigned',
  'registrations:review',
  'registrations:approve',
  'registrations:reject',
  'users:manage',
  'roles:assign',
  'audit_logs:read',
  'portal:configure',
] as const;

export type PermissionCode = (typeof PERMISSION_CODES)[number];

export const ROLE_PERMISSION_MATRIX: Record<RbacRoleCode, readonly PermissionCode[]> = {
  STUDENT: [
    'profile:read:own',
    'student:academics:read:own',
    'student:attendance:read:own',
    'student:results:read:own',
    'materials:read',
    'notices:read',
    'welfare:read',
  ],
  PARENT_GUARDIAN: [
    'profile:read:own',
    'parent:children:read:linked',
    'parent:contact:update:own',
    'notices:read',
    'welfare:read',
  ],
  TEACHER: [
    'profile:read:own',
    'staff:classes:read:assigned',
    'staff:students:read:assigned',
    'staff:attendance:submit:assigned',
    'materials:read',
    'materials:publish',
    'notices:read',
  ],
  HEADMASTER: [
    'profile:read:own',
    'staff:classes:read:assigned',
    'staff:students:read:assigned',
    'materials:read',
    'materials:publish',
    'notices:read',
    'notices:manage',
    'registrations:review',
    'registrations:approve',
    'registrations:reject',
    'audit_logs:read',
  ],
  SCHOOL_ADMIN: [
    'profile:read:own',
    'notices:read',
    'notices:manage',
    'registrations:review',
    'registrations:approve',
    'registrations:reject',
    'users:manage',
    'roles:assign',
    'audit_logs:read',
    'portal:configure',
  ],
  DATA_ENTRY_OPERATOR: ['profile:read:own', 'notices:read', 'materials:read'],
  AUDITOR: ['profile:read:own', 'notices:read', 'audit_logs:read'],
};

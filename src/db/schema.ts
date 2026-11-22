import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  check,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  index,
} from 'drizzle-orm/pg-core';

// Canonical PostgreSQL Enums
export const accountStatusEnum = pgEnum('account_status', [
  'draft',
  'pending_contact_verification',
  'pending_school_approval',
  'approved',
  'rejected',
  'suspended',
  'revoked',
]);

export const registrantTypeEnum = pgEnum('registrant_type', [
  'student',
  'parent_guardian',
  'staff',
]);

export const guardianVerificationStatusEnum = pgEnum('guardian_verification_status', [
  'pending',
  'approved',
  'rejected',
  'revoked',
]);

export const verificationChannelEnum = pgEnum('verification_channel', ['sms', 'email']);

export const otpPurposeEnum = pgEnum('otp_purpose', [
  'login',
  'register_verify',
  'recovery',
  'admin_stepup',
]);

export const recoveryStatusEnum = pgEnum('recovery_status', [
  'initiated',
  'verified',
  'office_assisted_required',
  'completed',
  'expired',
  'cancelled',
]);

// 1. users
export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    uid: text('uid').unique(), // Optional Firebase Auth UID linkage
    accountStatus: accountStatusEnum('account_status')
      .notNull()
      .default('pending_contact_verification'),
    primaryMobileE164: text('primary_mobile_e164').notNull(),
    mobileVerifiedAt: timestamp('mobile_verified_at', { withTimezone: true }),
    email: text('email'),
    emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
    mfaEnabled: boolean('mfa_enabled').notNull().default(false),
    mfaSecretEnc: text('mfa_secret_enc'),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('users_primary_mobile_active_uq')
      .on(table.primaryMobileE164)
      .where(sql`${table.deletedAt} IS NULL`),
    uniqueIndex('users_email_active_uq')
      .on(table.email)
      .where(sql`${table.email} IS NOT NULL AND ${table.deletedAt} IS NULL`),
  ]
);

// 2. school_enrollment_records (authorized school roster for verification; zero PII seeded in repo)
export const schoolEnrollmentRecords = pgTable(
  'school_enrollment_records',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    schoolStudentCode: text('school_student_code').notNull().unique(),
    satsRefHash: text('sats_ref_hash').unique(),
    studentFullName: text('student_full_name').notNull(),
    classGrade: integer('class_grade').notNull(),
    section: text('section'),
    academicYear: text('academic_year').notNull(),
    guardianMobileHash: text('guardian_mobile_hash').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check('school_enrollment_grade_chk', sql`${table.classGrade} IN (8, 9, 10)`),
  ]
);

// 3. staff_directory_records (authorized school staff directory for matching; zero PII seeded)
export const staffDirectoryRecords = pgTable('staff_directory_records', {
  id: uuid('id').defaultRandom().primaryKey(),
  officialStaffId: text('official_staff_id').notNull().unique(),
  fullName: text('full_name').notNull(),
  designation: text('designation').notNull(),
  departmentSubject: text('department_subject').notNull(),
  officialMobileHash: text('official_mobile_hash').notNull(),
  officialEmail: text('official_email').notNull().unique(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 4. student_profiles
export const studentProfiles = pgTable(
  'student_profiles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'restrict' }),
    enrollmentRecordId: uuid('enrollment_record_id').references(
      () => schoolEnrollmentRecords.id,
      { onDelete: 'set null' }
    ),
    schoolStudentCode: text('school_student_code').unique(),
    satsRefHash: text('sats_ref_hash').unique(),
    fullName: text('full_name').notNull(),
    classGrade: integer('class_grade').notNull(),
    section: text('section'),
    academicYear: text('academic_year').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    check('student_profiles_grade_chk', sql`${table.classGrade} IN (8, 9, 10)`),
  ]
);

// 5. staff_profiles
export const staffProfiles = pgTable('staff_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'restrict' }),
  directoryRecordId: uuid('directory_record_id').references(() => staffDirectoryRecords.id, {
    onDelete: 'set null',
  }),
  officialStaffId: text('official_staff_id').notNull().unique(),
  fullName: text('full_name').notNull(),
  designation: text('designation').notNull(),
  departmentSubject: text('department_subject').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 6. guardian_profiles
export const guardianProfiles = pgTable('guardian_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'restrict' }),
  fullName: text('full_name').notNull(),
  contactMobileE164: text('contact_mobile_e164').notNull(),
  email: text('email'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// 7. guardian_relationships
export const guardianRelationships = pgTable(
  'guardian_relationships',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    guardianProfileId: uuid('guardian_profile_id')
      .notNull()
      .references(() => guardianProfiles.id, { onDelete: 'cascade' }),
    studentProfileId: uuid('student_profile_id')
      .notNull()
      .references(() => studentProfiles.id, { onDelete: 'cascade' }),
    relationshipType: text('relationship_type').notNull(),
    verificationStatus: guardianVerificationStatusEnum('verification_status')
      .notNull()
      .default('pending'),
    verifiedByUserId: uuid('verified_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    verifiedAt: timestamp('verified_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('guardian_student_rel_uq').on(table.guardianProfileId, table.studentProfileId),
  ]
);

// 8. roles
export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  nameKn: text('name_kn').notNull(),
  nameEn: text('name_en').notNull(),
  isPrivileged: boolean('is_privileged').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 9. permissions
export const permissions = pgTable('permissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').notNull().unique(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// 10. user_roles
export const userRoles = pgTable(
  'user_roles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'restrict' }),
    assignedByUserId: uuid('assigned_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    assignedAt: timestamp('assigned_at', { withTimezone: true }).defaultNow().notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
  },
  (table) => [
    uniqueIndex('user_roles_active_uq')
      .on(table.userId, table.roleId)
      .where(sql`${table.revokedAt} IS NULL`),
  ]
);

// 11. role_permissions
export const rolePermissions = pgTable(
  'role_permissions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    permissionId: uuid('permission_id')
      .notNull()
      .references(() => permissions.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex('role_permissions_uq').on(table.roleId, table.permissionId)]
);

// 12. registration_requests
export const registrationRequests = pgTable(
  'registration_requests',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    referenceCode: text('reference_code').notNull().unique(),
    registrantType: registrantTypeEnum('registrant_type').notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: accountStatusEnum('status')
      .notNull()
      .default('pending_contact_verification'),
    identifierHash: text('identifier_hash').notNull(),
    matchedEnrollmentId: uuid('matched_enrollment_id').references(
      () => schoolEnrollmentRecords.id,
      { onDelete: 'set null' }
    ),
    matchedStaffDirId: uuid('matched_staff_dir_id').references(() => staffDirectoryRecords.id, {
      onDelete: 'set null',
    }),
    requiresGuardianVerification: boolean('requires_guardian_verification')
      .notNull()
      .default(false),
    submittedPayloadJson: jsonb('submitted_payload_json').notNull(),
    reviewedByUserId: uuid('reviewed_by_user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    reviewReason: text('review_reason'),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('registration_requests_status_idx').on(table.status),
    index('registration_requests_identifier_idx').on(table.identifierHash),
  ]
);

// 13. contact_verifications
export const contactVerifications = pgTable(
  'contact_verifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    registrationRequestId: uuid('registration_request_id').references(
      () => registrationRequests.id,
      { onDelete: 'cascade' }
    ),
    channel: verificationChannelEnum('channel').notNull(),
    targetValueHash: text('target_value_hash').notNull(),
    tokenHash: text('token_hash').notNull().unique(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    consumedAt: timestamp('consumed_at', { withTimezone: true }),
    attempts: integer('attempts').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('contact_verifications_user_channel_idx').on(table.userId, table.channel)]
);

// 14. otp_challenges (NEVER stores plaintext OTPs; stores keyed HMAC + salt only)
export const otpChallenges = pgTable(
  'otp_challenges',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    identifierHash: text('identifier_hash').notNull(),
    purpose: otpPurposeEnum('purpose').notNull(),
    otpHmac: text('otp_hmac').notNull(),
    salt: text('salt').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    attempts: integer('attempts').notNull().default(0),
    maxAttempts: integer('max_attempts').notNull().default(5),
    resendAvailableAt: timestamp('resend_available_at', { withTimezone: true }).notNull(),
    consumedAt: timestamp('consumed_at', { withTimezone: true }),
    ipHash: text('ip_hash').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('otp_challenges_identifier_purpose_idx').on(table.identifierHash, table.purpose)]
);

// 15. sessions
export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull().unique(),
    csrfSecretHash: text('csrf_secret_hash').notNull(),
    userAgentHash: text('user_agent_hash'),
    ipHash: text('ip_hash'),
    mfaVerifiedAt: timestamp('mfa_verified_at', { withTimezone: true }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    revokedAt: timestamp('revoked_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('sessions_user_active_idx').on(table.userId, table.expiresAt)]
);

// 16. audit_logs (append-only security & approval audit trail)
export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
    action: text('action').notNull(),
    targetEntity: text('target_entity').notNull(),
    targetId: text('target_id').notNull(),
    reason: text('reason'),
    approvalRef: text('approval_ref'),
    metadataJson: jsonb('metadata_json'),
    ipHash: text('ip_hash'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('audit_logs_action_created_idx').on(table.action, table.createdAt),
    index('audit_logs_actor_idx').on(table.actorUserId),
  ]
);

// 17. login_attempts
export const loginAttempts = pgTable(
  'login_attempts',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    identifierHash: text('identifier_hash').notNull(),
    ipHash: text('ip_hash').notNull(),
    succeeded: boolean('succeeded').notNull().default(false),
    failureReason: text('failure_reason'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('login_attempts_identifier_time_idx').on(table.identifierHash, table.createdAt),
    index('login_attempts_ip_time_idx').on(table.ipHash, table.createdAt),
  ]
);

// 18. recovery_requests
export const recoveryRequests = pgTable(
  'recovery_requests',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    accountType: registrantTypeEnum('account_type').notNull(),
    identifierHash: text('identifier_hash').notNull(),
    status: recoveryStatusEnum('status').notNull().default('initiated'),
    verifiedChannel: verificationChannelEnum('verified_channel'),
    ipHash: text('ip_hash').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('recovery_requests_identifier_idx').on(table.identifierHash)]
);

// 19. security_notifications
export const securityNotifications = pgTable(
  'security_notifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    eventType: text('event_type').notNull(),
    channel: verificationChannelEnum('channel').notNull(),
    deliveryStatus: text('delivery_status').notNull().default('pending'),
    messageSummary: text('message_summary').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index('security_notifications_user_idx').on(table.userId)]
);

// Relations (used by Drizzle typed queries)
export const usersRelations = relations(users, ({ one, many }) => ({
  studentProfile: one(studentProfiles, {
    fields: [users.id],
    references: [studentProfiles.userId],
  }),
  staffProfile: one(staffProfiles, {
    fields: [users.id],
    references: [staffProfiles.userId],
  }),
  guardianProfile: one(guardianProfiles, {
    fields: [users.id],
    references: [guardianProfiles.userId],
  }),
  userRoles: many(userRoles),
  registrationRequests: many(registrationRequests),
  sessions: many(sessions),
}));

export const registrationRequestsRelations = relations(registrationRequests, ({ one }) => ({
  user: one(users, {
    fields: [registrationRequests.userId],
    references: [users.id],
  }),
}));

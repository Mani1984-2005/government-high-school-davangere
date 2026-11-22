import fs from 'node:fs';
import path from 'node:path';
import type http from 'node:http';
import type { Request } from 'express';
import { afterEach, describe, expect, it } from 'vitest';
import { createApiApp } from '../app.ts';
import type { ServerConfig } from '../config/env.ts';
import type {
  AuthenticatedContext,
  AuthSessionResolver,
} from '../middleware/auth.guard.ts';
import type {
  CreateParentRegistrationTxInput,
  CreateStaffRegistrationTxInput,
  CreateStudentRegistrationTxInput,
  DuplicateCheckInput,
  RegistrationLookupRecord,
  RegistrationRepository,
} from '../modules/registration/registration.repository.ts';
import { DisabledDevEmailProvider } from '../providers/email.provider.ts';
import { DisabledDevSmsProvider } from '../providers/sms.provider.ts';

const TEST_CONFIG: ServerConfig = {
  nodeEnv: 'test',
  port: 0,
  corsAllowedOrigins: ['http://localhost:3000'],
  smsProvider: 'disabled_dev',
  emailProvider: 'disabled_dev',
  sessionSecret: 'test-session-secret-32-chars-minimum-length',
  otpHmacSecret: 'test-otp-hmac-secret-32-chars-minimum-len',
  dataHashPepper: 'test-data-pepper-32-chars-minimum-length',
};

class InMemoryTestRegistrationRepository implements RegistrationRepository {
  readonly records = new Map<string, RegistrationLookupRecord>();
  readonly studentInputs: CreateStudentRegistrationTxInput[] = [];
  readonly parentInputs: CreateParentRegistrationTxInput[] = [];
  readonly staffInputs: CreateStaffRegistrationTxInput[] = [];
  private readonly usedMobiles = new Set<string>();
  private readonly usedEmails = new Set<string>();
  private readonly usedStudentCodes = new Set<string>();
  private readonly usedStaffIds = new Set<string>();

  isReady(): boolean {
    return true;
  }

  async findDuplicate(input: DuplicateCheckInput): Promise<boolean> {
    if (this.usedMobiles.has(input.mobileE164)) return true;
    if (input.email && this.usedEmails.has(input.email)) return true;
    if (input.schoolStudentCode && this.usedStudentCodes.has(input.schoolStudentCode)) return true;
    if (input.officialStaffId && this.usedStaffIds.has(input.officialStaffId)) return true;
    return false;
  }

  async createStudentRegistration(input: CreateStudentRegistrationTxInput) {
    this.studentInputs.push(input);
    this.usedMobiles.add(input.mobileE164);
    if (input.email) this.usedEmails.add(input.email);
    if (input.schoolStudentCode) this.usedStudentCodes.add(input.schoolStudentCode);

    this.records.set(input.referenceCode, {
      referenceCode: input.referenceCode,
      registrantType: 'student',
      status: 'pending_contact_verification',
      identifierHash: input.identifierHash,
      requiresGuardianVerification: true,
    });
    return { registrationId: `reg-${this.studentInputs.length}`, userId: 'usr-1' };
  }

  async createParentRegistration(input: CreateParentRegistrationTxInput) {
    this.parentInputs.push(input);
    this.usedMobiles.add(input.guardianMobileE164);
    if (input.guardianEmail) this.usedEmails.add(input.guardianEmail);

    this.records.set(input.referenceCode, {
      referenceCode: input.referenceCode,
      registrantType: 'parent_guardian',
      status: 'pending_contact_verification',
      identifierHash: input.identifierHash,
      requiresGuardianVerification: true,
    });
    return { registrationId: `reg-p-${this.parentInputs.length}`, userId: 'usr-p-1' };
  }

  async createStaffRegistration(input: CreateStaffRegistrationTxInput) {
    this.staffInputs.push(input);
    this.usedMobiles.add(input.mobileE164);
    this.usedEmails.add(input.email);
    this.usedStaffIds.add(input.officialStaffId);

    this.records.set(input.referenceCode, {
      referenceCode: input.referenceCode,
      registrantType: 'staff',
      status: 'pending_contact_verification',
      identifierHash: input.identifierHash,
      requiresGuardianVerification: false,
    });
    return { registrationId: `reg-s-${this.staffInputs.length}`, userId: 'usr-s-1' };
  }

  async findByReferenceCode(referenceCode: string): Promise<RegistrationLookupRecord | null> {
    return this.records.get(referenceCode) ?? null;
  }
}

class StubAuthResolver implements AuthSessionResolver {
  private readonly tokens: Record<string, AuthenticatedContext>;

  constructor(tokens: Record<string, AuthenticatedContext>) {
    this.tokens = tokens;
  }

  async resolveFromRequest(req: Request): Promise<AuthenticatedContext | null> {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return null;
    const token = authHeader.slice('Bearer '.length).trim();
    return this.tokens[token] ?? null;
  }
}

async function startTestServer(deps: Parameters<typeof createApiApp>[0]) {
  const app = createApiApp(deps);
  const server = await new Promise<http.Server>((resolve) => {
    const srv = app.listen(0, '127.0.0.1', () => resolve(srv));
  });
  const addr = server.address();
  if (!addr || typeof addr === 'string') {
    throw new Error('Failed to bind ephemeral port.');
  }
  return {
    server,
    baseUrl: `http://127.0.0.1:${addr.port}`,
  };
}

describe('Milestone 2 — Registration, Providers, Schema Constraints & Authorization Boundaries', () => {
  const activeServers: http.Server[] = [];

  afterEach(async () => {
    while (activeServers.length > 0) {
      const srv = activeServers.pop();
      if (srv) {
        await new Promise<void>((resolve) => srv.close(() => resolve()));
      }
    }
  });

  it('registers valid student with guardian consent, hashes OTP, and disables real SMS in dev', async () => {
    const repo = new InMemoryTestRegistrationRepository();
    const { server, baseUrl } = await startTestServer({
      config: TEST_CONFIG,
      registrationRepo: repo,
      smsProvider: new DisabledDevSmsProvider(),
      emailProvider: new DisabledDevEmailProvider(),
    });
    activeServers.push(server);

    const res = await fetch(`${baseUrl}/api/v1/auth/register/student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: 'Test Student Applicant',
        studentIdentifier: 'DVG2025001',
        classGrade: 9,
        section: 'A',
        academicYear: '2025-26',
        mobileNumber: '9876543210',
        email: 'student.applicant@example.org',
        guardianName: 'Guardian Applicant',
        guardianRelationship: 'mother',
        guardianMobileNumber: '9876543211',
        minorGuardianConsent: true,
      }),
    });

    expect(res.status).toBe(201);
    const body = (await res.json()) as {
      accepted: boolean;
      referenceCode: string;
      status: string;
      requiresGuardianVerification: boolean;
      contactVerification: { mobileDeliveryStatus: string; emailDeliveryStatus: string };
    };

    expect(body.accepted).toBe(true);
    expect(body.referenceCode).toMatch(/^GHS-REG-\d{4}-[A-F0-9]{8}$/);
    expect(body.status).toBe('pending_contact_verification');
    expect(body.requiresGuardianVerification).toBe(true);
    expect(body.contactVerification.mobileDeliveryStatus).toBe('disabled_dev');
    expect(body.contactVerification.emailDeliveryStatus).toBe('disabled_dev');

    // Verify plaintext OTP is NOT stored in repository payload and mobile was normalized
    expect(repo.studentInputs).toHaveLength(1);
    expect(repo.studentInputs[0].mobileE164).toBe('+919876543210');
    expect(repo.studentInputs[0].otpHmac).toMatch(/^[a-f0-9]{64}$/);
    expect(repo.studentInputs[0].otpSalt).toMatch(/^[a-f0-9]{32}$/);
  });

  it('rejects Aadhaar fields and client role/status self-assignment', async () => {
    const repo = new InMemoryTestRegistrationRepository();
    const { server, baseUrl } = await startTestServer({
      config: TEST_CONFIG,
      registrationRepo: repo,
    });
    activeServers.push(server);

    const aadhaarAttempt = await fetch(`${baseUrl}/api/v1/auth/register/student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: 'Applicant Name',
        classGrade: 8,
        academicYear: '2025-26',
        mobileNumber: '9876543210',
        guardianName: 'Guardian Name',
        guardianRelationship: 'father',
        guardianMobileNumber: '9876543211',
        minorGuardianConsent: true,
        aadhaarNumber: '123412341234',
      }),
    });
    expect(aadhaarAttempt.status).toBe(400);

    const roleAttempt = await fetch(`${baseUrl}/api/v1/auth/register/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Staff Applicant',
        officialStaffId: 'KGID9001',
        designation: 'Teacher',
        departmentOrSubject: 'Mathematics',
        mobileNumber: '9876543212',
        email: 'staff@karnataka.gov.in',
        role: 'SCHOOL_ADMIN',
      }),
    });
    expect(roleAttempt.status).toBe(400);
    expect(repo.studentInputs).toHaveLength(0);
    expect(repo.staffInputs).toHaveLength(0);
  });

  it('enforces validation rules and prevents duplicate registrations', async () => {
    const repo = new InMemoryTestRegistrationRepository();
    const { server, baseUrl } = await startTestServer({
      config: TEST_CONFIG,
      registrationRepo: repo,
    });
    activeServers.push(server);

    // Invalid grade (only 8, 9, 10 permitted)
    const badGrade = await fetch(`${baseUrl}/api/v1/auth/register/student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: 'Applicant Name',
        classGrade: 7,
        academicYear: '2025-26',
        mobileNumber: '9876543210',
        guardianName: 'Guardian Name',
        guardianRelationship: 'mother',
        guardianMobileNumber: '9876543211',
        minorGuardianConsent: true,
      }),
    });
    expect(badGrade.status).toBe(400);

    // Missing minor guardian consent
    const noConsent = await fetch(`${baseUrl}/api/v1/auth/register/student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName: 'Applicant Name',
        classGrade: 10,
        academicYear: '2025-26',
        mobileNumber: '9876543210',
        guardianName: 'Guardian Name',
        guardianRelationship: 'mother',
        guardianMobileNumber: '9876543211',
        minorGuardianConsent: false,
      }),
    });
    expect(noConsent.status).toBe(400);

    // Valid staff registration followed by duplicate staff registration
    const staffPayload = {
      fullName: 'Teacher Applicant',
      officialStaffId: 'KGID55001',
      designation: 'Assistant Master',
      departmentOrSubject: 'Science',
      mobileNumber: '9845011223',
      email: 'teacher.applicant@karnataka.gov.in',
    };
    const firstStaff = await fetch(`${baseUrl}/api/v1/auth/register/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffPayload),
    });
    expect(firstStaff.status).toBe(201);

    const dupStaff = await fetch(`${baseUrl}/api/v1/auth/register/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(staffPayload),
    });
    expect(dupStaff.status).toBe(409);
  });

  it('prevents account enumeration on registration status lookup', async () => {
    const repo = new InMemoryTestRegistrationRepository();
    const { server, baseUrl } = await startTestServer({
      config: TEST_CONFIG,
      registrationRepo: repo,
    });
    activeServers.push(server);

    const regRes = await fetch(`${baseUrl}/api/v1/auth/register/parent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guardianName: 'Parent Applicant',
        relationship: 'father',
        guardianMobileNumber: '9988776655',
        studentIdentifier: 'STU8899',
        studentName: 'Enrolled Student',
        classGrade: 8,
        academicYear: '2025-26',
      }),
    });
    expect(regRes.status).toBe(201);
    const { referenceCode } = (await regRes.json()) as { referenceCode: string };

    // Correct referenceCode + matching mobile reveals pending status
    const okLookup = await fetch(`${baseUrl}/api/v1/auth/registration-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referenceCode, identifier: '9988776655' }),
    });
    expect(okLookup.status).toBe(200);
    const okBody = (await okLookup.json()) as { status: string; requiresSchoolApproval: boolean };
    expect(okBody.status).toBe('pending_contact_verification');
    expect(okBody.requiresSchoolApproval).toBe(true);

    // Mismatched identifier vs unknown reference code return identical generic 'unavailable' status
    const wrongId = await fetch(`${baseUrl}/api/v1/auth/registration-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referenceCode, identifier: '9000000000' }),
    });
    const wrongRef = await fetch(`${baseUrl}/api/v1/auth/registration-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referenceCode: 'GHS-REG-2026-DEADBEEF',
        identifier: '9988776655',
      }),
    });

    const wrongIdBody = (await wrongId.json()) as { status: string; messageEn: string };
    const wrongRefBody = (await wrongRef.json()) as { status: string; messageEn: string };
    expect(wrongIdBody.status).toBe('unavailable');
    expect(wrongRefBody.status).toBe('unavailable');
    expect(wrongIdBody.messageEn).toBe(wrongRefBody.messageEn);
  });

  it('enforces authorization boundaries: rejects unauthenticated, unapproved, wrong-role, and non-MFA privileged callers', async () => {
    const authResolver = new StubAuthResolver({
      'pending-token': {
        userId: 'u-pending',
        accountStatus: 'pending_school_approval',
        roles: ['STUDENT'],
        permissions: ['profile:read:own'],
        mfaVerified: false,
      },
      'suspended-token': {
        userId: 'u-suspended',
        accountStatus: 'suspended',
        roles: ['TEACHER'],
        permissions: ['profile:read:own'],
        mfaVerified: true,
      },
      'student-token': {
        userId: 'u-student',
        accountStatus: 'approved',
        roles: ['STUDENT'],
        permissions: ['profile:read:own'],
        mfaVerified: false,
      },
      'teacher-no-mfa': {
        userId: 'u-teacher-nomfa',
        accountStatus: 'approved',
        roles: ['TEACHER'],
        permissions: ['profile:read:own', 'registrations:review'],
        mfaVerified: false,
      },
      'teacher-mfa': {
        userId: 'u-teacher',
        accountStatus: 'approved',
        roles: ['TEACHER'],
        permissions: ['profile:read:own'],
        mfaVerified: true,
      },
    });

    const { server, baseUrl } = await startTestServer({
      config: TEST_CONFIG,
      authResolver,
    });
    activeServers.push(server);

    // 1. Unauthenticated caller -> 401
    const unauthRes = await fetch(`${baseUrl}/api/v1/student/profile`);
    expect(unauthRes.status).toBe(401);

    // 2. Pending school approval account -> 403
    const pendingRes = await fetch(`${baseUrl}/api/v1/student/profile`, {
      headers: { Authorization: 'Bearer pending-token' },
    });
    expect(pendingRes.status).toBe(403);

    // 3. Suspended account -> 403
    const suspendedRes = await fetch(`${baseUrl}/api/v1/staff/profile`, {
      headers: { Authorization: 'Bearer suspended-token' },
    });
    expect(suspendedRes.status).toBe(403);

    // 4. Approved student hitting staff/admin endpoint -> 403
    const studentAdminRes = await fetch(`${baseUrl}/api/v1/admin/registrations`, {
      headers: { Authorization: 'Bearer student-token' },
    });
    expect(studentAdminRes.status).toBe(403);

    // 5. Teacher without MFA hitting privileged endpoint -> 403 MFA_REQUIRED
    const teacherNoMfaRes = await fetch(`${baseUrl}/api/v1/staff/profile`, {
      headers: { Authorization: 'Bearer teacher-no-mfa' },
    });
    expect(teacherNoMfaRes.status).toBe(403);
    const teacherNoMfaBody = (await teacherNoMfaRes.json()) as { errorCode: string };
    expect(teacherNoMfaBody.errorCode).toBe('MFA_REQUIRED');

    // 6. Teacher with MFA hitting admin registrations -> 403 FORBIDDEN_ROLE
    const teacherAdminRes = await fetch(`${baseUrl}/api/v1/admin/registrations`, {
      headers: { Authorization: 'Bearer teacher-mfa' },
    });
    expect(teacherAdminRes.status).toBe(403);
  });

  it('verifies generated SQL migration defines all 19 normalized tables and grade/security constraints', () => {
    const migrationPath = path.resolve(process.cwd(), 'drizzle/0000_phase5_initial.sql');
    const sqlContent = fs.readFileSync(migrationPath, 'utf8');

    const expectedTables = [
      'users',
      'student_profiles',
      'staff_profiles',
      'guardian_profiles',
      'guardian_relationships',
      'roles',
      'permissions',
      'user_roles',
      'role_permissions',
      'registration_requests',
      'school_enrollment_records',
      'staff_directory_records',
      'contact_verifications',
      'otp_challenges',
      'sessions',
      'audit_logs',
      'login_attempts',
      'recovery_requests',
      'security_notifications',
    ];

    for (const tableName of expectedTables) {
      expect(sqlContent).toContain(`CREATE TABLE "${tableName}"`);
    }

    expect(sqlContent).toContain('IN (8, 9, 10)');
    expect(sqlContent).toContain('"otp_hmac" text NOT NULL');
    expect(sqlContent).not.toMatch(/aadhaar/i);
  });
});

import { and, eq, isNull, or } from 'drizzle-orm';
import { db, isDatabaseConfigured } from '../../../src/db/index.ts';
import {
  auditLogs,
  contactVerifications,
  guardianProfiles,
  guardianRelationships,
  otpChallenges,
  registrationRequests,
  schoolEnrollmentRecords,
  staffDirectoryRecords,
  staffProfiles,
  studentProfiles,
  users,
} from '../../../src/db/schema.ts';
import type { RegistrationStatus } from '../../../shared/constants/roles.ts';
import type { RegistrantType } from '../../../shared/types/auth.ts';

export interface DuplicateCheckInput {
  mobileE164: string;
  email?: string;
  schoolStudentCode?: string;
  satsRefHash?: string;
  officialStaffId?: string;
}

export interface CreateStudentRegistrationTxInput {
  referenceCode: string;
  mobileE164: string;
  email?: string;
  identifierHash: string;
  studentName: string;
  schoolStudentCode?: string;
  satsRefHash?: string;
  classGrade: 8 | 9 | 10;
  section?: string;
  academicYear: string;
  submittedPayload: Record<string, unknown>;
  otpHmac: string;
  otpSalt: string;
  otpExpiresAt: Date;
  resendAvailableAt: Date;
  ipHash: string;
  emailTokenHash?: string;
  emailTokenTargetHash?: string;
  emailTokenExpiresAt?: Date;
}

export interface CreateParentRegistrationTxInput {
  referenceCode: string;
  guardianName: string;
  guardianMobileE164: string;
  guardianEmail?: string;
  relationship: 'mother' | 'father' | 'legal_guardian';
  studentIdentifier: string;
  identifierHash: string;
  submittedPayload: Record<string, unknown>;
  otpHmac: string;
  otpSalt: string;
  otpExpiresAt: Date;
  resendAvailableAt: Date;
  ipHash: string;
  emailTokenHash?: string;
  emailTokenTargetHash?: string;
  emailTokenExpiresAt?: Date;
}

export interface CreateStaffRegistrationTxInput {
  referenceCode: string;
  fullName: string;
  officialStaffId: string;
  designation: string;
  departmentOrSubject: string;
  mobileE164: string;
  email: string;
  identifierHash: string;
  submittedPayload: Record<string, unknown>;
  otpHmac: string;
  otpSalt: string;
  otpExpiresAt: Date;
  resendAvailableAt: Date;
  ipHash: string;
  emailTokenHash: string;
  emailTokenTargetHash: string;
  emailTokenExpiresAt: Date;
}

export interface RegistrationLookupRecord {
  referenceCode: string;
  registrantType: RegistrantType;
  status: RegistrationStatus;
  identifierHash: string;
  requiresGuardianVerification: boolean;
}

export interface RegistrationRepository {
  isReady(): boolean;
  findDuplicate(input: DuplicateCheckInput): Promise<boolean>;
  createStudentRegistration(
    input: CreateStudentRegistrationTxInput
  ): Promise<{ registrationId: string; userId: string }>;
  createParentRegistration(
    input: CreateParentRegistrationTxInput
  ): Promise<{ registrationId: string; userId: string }>;
  createStaffRegistration(
    input: CreateStaffRegistrationTxInput
  ): Promise<{ registrationId: string; userId: string }>;
  findByReferenceCode(referenceCode: string): Promise<RegistrationLookupRecord | null>;
}

export class DrizzleRegistrationRepository implements RegistrationRepository {
  isReady(): boolean {
    return isDatabaseConfigured();
  }

  async findDuplicate(input: DuplicateCheckInput): Promise<boolean> {
    try {
      const userConditions = [eq(users.primaryMobileE164, input.mobileE164)];
      if (input.email) {
        userConditions.push(eq(users.email, input.email));
      }

      const existingUser = await db
        .select({ id: users.id })
        .from(users)
        .where(and(or(...userConditions), isNull(users.deletedAt)))
        .limit(1);

      if (existingUser.length > 0) {
        return true;
      }

      if (input.schoolStudentCode || input.satsRefHash) {
        const studentConds = [];
        if (input.schoolStudentCode) {
          studentConds.push(eq(studentProfiles.schoolStudentCode, input.schoolStudentCode));
        }
        if (input.satsRefHash) {
          studentConds.push(eq(studentProfiles.satsRefHash, input.satsRefHash));
        }
        const existingStudent = await db
          .select({ id: studentProfiles.id })
          .from(studentProfiles)
          .where(or(...studentConds))
          .limit(1);

        if (existingStudent.length > 0) {
          return true;
        }
      }

      if (input.officialStaffId) {
        const existingStaff = await db
          .select({ id: staffProfiles.id })
          .from(staffProfiles)
          .where(eq(staffProfiles.officialStaffId, input.officialStaffId))
          .limit(1);
        if (existingStaff.length > 0) {
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Duplicate registration check failed:', error);
      throw new Error('Unable to verify registration eligibility.', { cause: error });
    }
  }

  async createStudentRegistration(
    input: CreateStudentRegistrationTxInput
  ): Promise<{ registrationId: string; userId: string }> {
    try {
      return await db.transaction(async (tx) => {
        let matchedEnrollmentId: string | null = null;
        if (input.schoolStudentCode || input.satsRefHash) {
          const matchConditions = [];
          if (input.schoolStudentCode) {
            matchConditions.push(
              eq(schoolEnrollmentRecords.schoolStudentCode, input.schoolStudentCode)
            );
          }
          if (input.satsRefHash) {
            matchConditions.push(eq(schoolEnrollmentRecords.satsRefHash, input.satsRefHash));
          }
          const matched = await tx
            .select({ id: schoolEnrollmentRecords.id })
            .from(schoolEnrollmentRecords)
            .where(and(or(...matchConditions), eq(schoolEnrollmentRecords.isActive, true)))
            .limit(1);
          matchedEnrollmentId = matched[0]?.id ?? null;
        }

        const [createdUser] = await tx
          .insert(users)
          .values({
            accountStatus: 'pending_contact_verification',
            primaryMobileE164: input.mobileE164,
            email: input.email ?? null,
          })
          .returning({ id: users.id });

        await tx.insert(studentProfiles).values({
          userId: createdUser.id,
          enrollmentRecordId: matchedEnrollmentId,
          schoolStudentCode: input.schoolStudentCode ?? null,
          satsRefHash: input.satsRefHash ?? null,
          fullName: input.studentName,
          classGrade: input.classGrade,
          section: input.section ?? null,
          academicYear: input.academicYear,
        });

        const [createdReq] = await tx
          .insert(registrationRequests)
          .values({
            referenceCode: input.referenceCode,
            registrantType: 'student',
            userId: createdUser.id,
            status: 'pending_contact_verification',
            identifierHash: input.identifierHash,
            matchedEnrollmentId,
            requiresGuardianVerification: true,
            submittedPayloadJson: input.submittedPayload,
          })
          .returning({ id: registrationRequests.id });

        await tx.insert(otpChallenges).values({
          userId: createdUser.id,
          identifierHash: input.identifierHash,
          purpose: 'register_verify',
          otpHmac: input.otpHmac,
          salt: input.otpSalt,
          expiresAt: input.otpExpiresAt,
          resendAvailableAt: input.resendAvailableAt,
          ipHash: input.ipHash,
        });

        if (input.emailTokenHash && input.emailTokenTargetHash && input.emailTokenExpiresAt) {
          await tx.insert(contactVerifications).values({
            userId: createdUser.id,
            registrationRequestId: createdReq.id,
            channel: 'email',
            targetValueHash: input.emailTokenTargetHash,
            tokenHash: input.emailTokenHash,
            expiresAt: input.emailTokenExpiresAt,
          });
        }

        await tx.insert(auditLogs).values({
          actorUserId: createdUser.id,
          action: 'STUDENT_REGISTRATION_SUBMITTED',
          targetEntity: 'registration_requests',
          targetId: createdReq.id,
          metadataJson: {
            referenceCode: input.referenceCode,
            matchedEnrollment: Boolean(matchedEnrollmentId),
          },
          ipHash: input.ipHash,
        });

        return { registrationId: createdReq.id, userId: createdUser.id };
      });
    } catch (error) {
      console.error('Student registration persistence failed:', error);
      throw new Error('Failed to create student registration request.', { cause: error });
    }
  }

  async createParentRegistration(
    input: CreateParentRegistrationTxInput
  ): Promise<{ registrationId: string; userId: string }> {
    try {
      return await db.transaction(async (tx) => {
        const matchedStudent = await tx
          .select({ id: studentProfiles.id, enrollmentRecordId: studentProfiles.enrollmentRecordId })
          .from(studentProfiles)
          .where(eq(studentProfiles.schoolStudentCode, input.studentIdentifier))
          .limit(1);

        const [createdUser] = await tx
          .insert(users)
          .values({
            accountStatus: 'pending_contact_verification',
            primaryMobileE164: input.guardianMobileE164,
            email: input.guardianEmail ?? null,
          })
          .returning({ id: users.id });

        const [createdGuardian] = await tx
          .insert(guardianProfiles)
          .values({
            userId: createdUser.id,
            fullName: input.guardianName,
            contactMobileE164: input.guardianMobileE164,
            email: input.guardianEmail ?? null,
          })
          .returning({ id: guardianProfiles.id });

        if (matchedStudent[0]) {
          await tx.insert(guardianRelationships).values({
            guardianProfileId: createdGuardian.id,
            studentProfileId: matchedStudent[0].id,
            relationshipType: input.relationship,
            verificationStatus: 'pending',
          });
        }

        const [createdReq] = await tx
          .insert(registrationRequests)
          .values({
            referenceCode: input.referenceCode,
            registrantType: 'parent_guardian',
            userId: createdUser.id,
            status: 'pending_contact_verification',
            identifierHash: input.identifierHash,
            matchedEnrollmentId: matchedStudent[0]?.enrollmentRecordId ?? null,
            requiresGuardianVerification: true,
            submittedPayloadJson: input.submittedPayload,
          })
          .returning({ id: registrationRequests.id });

        await tx.insert(otpChallenges).values({
          userId: createdUser.id,
          identifierHash: input.identifierHash,
          purpose: 'register_verify',
          otpHmac: input.otpHmac,
          salt: input.otpSalt,
          expiresAt: input.otpExpiresAt,
          resendAvailableAt: input.resendAvailableAt,
          ipHash: input.ipHash,
        });

        if (input.emailTokenHash && input.emailTokenTargetHash && input.emailTokenExpiresAt) {
          await tx.insert(contactVerifications).values({
            userId: createdUser.id,
            registrationRequestId: createdReq.id,
            channel: 'email',
            targetValueHash: input.emailTokenTargetHash,
            tokenHash: input.emailTokenHash,
            expiresAt: input.emailTokenExpiresAt,
          });
        }

        await tx.insert(auditLogs).values({
          actorUserId: createdUser.id,
          action: 'PARENT_REGISTRATION_SUBMITTED',
          targetEntity: 'registration_requests',
          targetId: createdReq.id,
          metadataJson: {
            referenceCode: input.referenceCode,
            linkedPendingStudent: Boolean(matchedStudent[0]),
          },
          ipHash: input.ipHash,
        });

        return { registrationId: createdReq.id, userId: createdUser.id };
      });
    } catch (error) {
      console.error('Parent registration persistence failed:', error);
      throw new Error('Failed to create parent/guardian registration request.', { cause: error });
    }
  }

  async createStaffRegistration(
    input: CreateStaffRegistrationTxInput
  ): Promise<{ registrationId: string; userId: string }> {
    try {
      return await db.transaction(async (tx) => {
        const matchedStaff = await tx
          .select({ id: staffDirectoryRecords.id })
          .from(staffDirectoryRecords)
          .where(
            and(
              eq(staffDirectoryRecords.officialStaffId, input.officialStaffId),
              eq(staffDirectoryRecords.isActive, true)
            )
          )
          .limit(1);

        const matchedStaffDirId = matchedStaff[0]?.id ?? null;

        const [createdUser] = await tx
          .insert(users)
          .values({
            accountStatus: 'pending_contact_verification',
            primaryMobileE164: input.mobileE164,
            email: input.email,
          })
          .returning({ id: users.id });

        await tx.insert(staffProfiles).values({
          userId: createdUser.id,
          directoryRecordId: matchedStaffDirId,
          officialStaffId: input.officialStaffId,
          fullName: input.fullName,
          designation: input.designation,
          departmentSubject: input.departmentOrSubject,
        });

        const [createdReq] = await tx
          .insert(registrationRequests)
          .values({
            referenceCode: input.referenceCode,
            registrantType: 'staff',
            userId: createdUser.id,
            status: 'pending_contact_verification',
            identifierHash: input.identifierHash,
            matchedStaffDirId,
            requiresGuardianVerification: false,
            submittedPayloadJson: input.submittedPayload,
          })
          .returning({ id: registrationRequests.id });

        await tx.insert(otpChallenges).values({
          userId: createdUser.id,
          identifierHash: input.identifierHash,
          purpose: 'register_verify',
          otpHmac: input.otpHmac,
          salt: input.otpSalt,
          expiresAt: input.otpExpiresAt,
          resendAvailableAt: input.resendAvailableAt,
          ipHash: input.ipHash,
        });

        await tx.insert(contactVerifications).values({
          userId: createdUser.id,
          registrationRequestId: createdReq.id,
          channel: 'email',
          targetValueHash: input.emailTokenTargetHash,
          tokenHash: input.emailTokenHash,
          expiresAt: input.emailTokenExpiresAt,
        });

        await tx.insert(auditLogs).values({
          actorUserId: createdUser.id,
          action: 'STAFF_REGISTRATION_SUBMITTED',
          targetEntity: 'registration_requests',
          targetId: createdReq.id,
          metadataJson: {
            referenceCode: input.referenceCode,
            matchedDirectoryRecord: Boolean(matchedStaffDirId),
          },
          ipHash: input.ipHash,
        });

        return { registrationId: createdReq.id, userId: createdUser.id };
      });
    } catch (error) {
      console.error('Staff registration persistence failed:', error);
      throw new Error('Failed to create staff registration request.', { cause: error });
    }
  }

  async findByReferenceCode(referenceCode: string): Promise<RegistrationLookupRecord | null> {
    try {
      const rows = await db
        .select({
          referenceCode: registrationRequests.referenceCode,
          registrantType: registrationRequests.registrantType,
          status: registrationRequests.status,
          identifierHash: registrationRequests.identifierHash,
          requiresGuardianVerification: registrationRequests.requiresGuardianVerification,
        })
        .from(registrationRequests)
        .where(eq(registrationRequests.referenceCode, referenceCode))
        .limit(1);

      return rows[0] ?? null;
    } catch (error) {
      console.error('Registration lookup failed:', error);
      throw new Error('Unable to retrieve registration status.', { cause: error });
    }
  }
}

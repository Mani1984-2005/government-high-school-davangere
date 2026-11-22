import type { RbacRoleCode, RegistrationStatus } from '../constants/roles.ts';

export type RegistrantType = 'student' | 'parent_guardian' | 'staff';

export interface StudentRegistrationPayload {
  studentName: string;
  studentIdentifier?: string;
  satsRef?: string;
  classGrade: 8 | 9 | 10;
  section?: string;
  academicYear: string;
  mobileNumber: string;
  email?: string;
  guardianName: string;
  guardianRelationship: 'mother' | 'father' | 'legal_guardian';
  guardianMobileNumber: string;
  guardianEmail?: string;
  minorGuardianConsent: boolean;
}

export interface ParentRegistrationPayload {
  guardianName: string;
  relationship: 'mother' | 'father' | 'legal_guardian';
  guardianMobileNumber: string;
  guardianEmail?: string;
  studentIdentifier: string;
  studentName: string;
  classGrade: 8 | 9 | 10;
  academicYear: string;
}

export interface StaffRegistrationPayload {
  fullName: string;
  officialStaffId: string;
  designation: string;
  departmentOrSubject: string;
  mobileNumber: string;
  email: string;
}

export interface RegistrationSubmitResponse {
  accepted: boolean;
  referenceCode: string;
  status: RegistrationStatus;
  registrantType: RegistrantType;
  requiresGuardianVerification: boolean;
  contactVerification: {
    mobileDeliveryStatus: 'disabled_dev' | 'queued' | 'dispatched' | 'unavailable';
    emailDeliveryStatus: 'disabled_dev' | 'queued' | 'dispatched' | 'not_provided' | 'unavailable';
    noteKn: string;
    noteEn: string;
  };
  messageKn: string;
  messageEn: string;
}

export interface RegistrationStatusLookupPayload {
  referenceCode: string;
  identifier: string;
}

export interface RegistrationStatusLookupResponse {
  referenceCode: string;
  status: RegistrationStatus | 'unavailable';
  requiresSchoolApproval: boolean;
  messageKn: string;
  messageEn: string;
  nextStepKn: string;
  nextStepEn: string;
}

export interface AuthenticatedUserSummary {
  id: string;
  accountStatus: RegistrationStatus;
  roles: RbacRoleCode[];
  mfaEnabled: boolean;
}

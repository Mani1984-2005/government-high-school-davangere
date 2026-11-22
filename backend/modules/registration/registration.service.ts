import { OTP_POLICY } from '../../../shared/constants/authPolicy.ts';
import type { RegistrationStatus } from '../../../shared/constants/roles.ts';
import type {
  ParentRegistrationPayload,
  RegistrationStatusLookupPayload,
  RegistrationStatusLookupResponse,
  RegistrationSubmitResponse,
  StaffRegistrationPayload,
  StudentRegistrationPayload,
} from '../../../shared/types/auth.ts';
import type { ServerConfig } from '../../config/env.ts';
import type { EmailDispatchResult, EmailProvider } from '../../providers/email.provider.ts';
import type { SmsDispatchResult, SmsProvider } from '../../providers/sms.provider.ts';
import {
  generateNumericOtp,
  generateOpaqueToken,
  generateRegistrationReferenceCode,
  generateSaltHex,
  hmacSha256Hex,
  normalizeIndianMobileE164,
  timingSafeHexEqual,
} from '../../utils/crypto.ts';
import type { RegistrationRepository } from './registration.repository.ts';

export class RegistrationError extends Error {
  readonly statusCode: number;
  readonly errorCode: string;

  constructor(statusCode: number, errorCode: string, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

const STATUS_MESSAGES: Record<
  RegistrationStatus,
  {
    messageKn: string;
    messageEn: string;
    nextStepKn: string;
    nextStepEn: string;
  }
> = {
  draft: {
    messageKn: 'ನೋಂದಣಿ ಅರ್ಜಿ ಕರಡು ಹಂತದಲ್ಲಿದೆ.',
    messageEn: 'Registration is saved in draft status.',
    nextStepKn: 'ಸಂಪೂರ್ಣ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ ಸಲ್ಲಿಸಿ.',
    nextStepEn: 'Complete required fields and submit for verification.',
  },
  pending_contact_verification: {
    messageKn: 'ಮೊಬೈಲ್ OTP / ಇಮೇಲ್ ಸಂಪರ್ಕ ದೃಢೀಕರಣ ಬಾಕಿಯಿದೆ.',
    messageEn: 'Pending mobile OTP and/or email contact verification.',
    nextStepKn: 'ಸಂಪರ್ಕ ದೃಢೀಕರಣ ಪೂರ್ಣಗೊಂಡ ನಂತರ ಶಾಲಾ ಕಚೇರಿ ಅನುಮೋದನೆಗೆ ಸಲ್ಲಿಸಲಾಗುತ್ತದೆ.',
    nextStepEn: 'Once contact verification completes, the application moves to school approval.',
  },
  pending_school_approval: {
    messageKn: 'ಸಂಪರ್ಕ ದೃಢೀಕೃತವಾಗಿದೆ. ಶಾಲಾ ಮುಖ್ಯ ಶಿಕ್ಷಕರು / ಕಚೇರಿ ಅನುಮೋದನೆ ಬಾಕಿಯಿದೆ.',
    messageEn: 'Contact verified. Awaiting school office / Headmaster verification and approval.',
    nextStepKn: 'ಶಾಲಾ ದಾಖಲೆಗಳೊಂದಿಗೆ ಪರಿಶೀಲಿಸಿದ ನಂತರ ಖಾತೆಯನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಲಾಗುತ್ತದೆ.',
    nextStepEn: 'Your account will be activated after verification against official school records.',
  },
  approved: {
    messageKn: 'ನಿಮ್ಮ ನೋಂದಣಿ ಶಾಲಾ ಆಡಳಿತದಿಂದ ಅನುಮೋದಿಸಲ್ಪಟ್ಟಿದೆ.',
    messageEn: 'Your registration has been approved by the school administration.',
    nextStepKn: 'ನಿಮ್ಮ ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ಮೂಲಕ ಲಾಗಿನ್ ಆಗಬಹುದು.',
    nextStepEn: 'You may sign in through the official school portal.',
  },
  rejected: {
    messageKn: 'ನೋಂದಣಿ ಅರ್ಜಿಯನ್ನು ಶಾಲಾ ಕಚೇರಿ ಅನುಮೋದಿಸಿಲ್ಲ.',
    messageEn: 'This registration request was not approved.',
    nextStepKn: 'ಹೆಚ್ಚಿನ ವಿವರಗಳಿಗಾಗಿ ಮೂಲ ದಾಖಲೆಗಳೊಂದಿಗೆ ಶಾಲಾ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    nextStepEn: 'Please visit the school office with supporting records for assistance.',
  },
  suspended: {
    messageKn: 'ಭದ್ರತೆ ಅಥವಾ ಆಡಳಿತಾತ್ಮಕ ಕಾರಣದಿಂದ ಖಾತೆಯನ್ನು ತಾತ್ಕಾಲಿಕವಾಗಿ ಅಮಾನತುಗೊಳಿಸಲಾಗಿದೆ.',
    messageEn: 'Account access is temporarily suspended.',
    nextStepKn: 'ಶಾಲಾ ಮುಖ್ಯ ಶಿಕ್ಷಕರು / ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
    nextStepEn: 'Contact the Headmaster or School Administrator for review.',
  },
  revoked: {
    messageKn: 'ಈ ಖಾತೆಯ ಪ್ರವೇಶವನ್ನು ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ.',
    messageEn: 'Access for this registration has been revoked.',
    nextStepKn: 'ಶಾಲಾ ಕಚೇರಿಯ ಅಧಿಕೃತ ಅನುಮೋದನೆ ಅಗತ್ಯವಿದೆ.',
    nextStepEn: 'Contact the school office for formal re-verification.',
  },
};

export class RegistrationService {
  private readonly repo: RegistrationRepository;
  private readonly smsProvider: SmsProvider;
  private readonly emailProvider: EmailProvider;
  private readonly config: ServerConfig;

  constructor(deps: {
    repo: RegistrationRepository;
    smsProvider: SmsProvider;
    emailProvider: EmailProvider;
    config: ServerConfig;
  }) {
    this.repo = deps.repo;
    this.smsProvider = deps.smsProvider;
    this.emailProvider = deps.emailProvider;
    this.config = deps.config;
  }

  private assertDbReady(): void {
    if (!this.repo.isReady()) {
      throw new RegistrationError(
        503,
        'DATABASE_UNCONFIGURED',
        'Portal database connection is not configured in this environment.'
      );
    }
  }

  private buildContactVerificationNote(
    smsResult: SmsDispatchResult,
    emailResult?: EmailDispatchResult
  ) {
    const mobileDeliveryStatus = smsResult.status;
    const emailDeliveryStatus = emailResult ? emailResult.status : 'not_provided';

    if (mobileDeliveryStatus === 'disabled_dev') {
      return {
        mobileDeliveryStatus,
        emailDeliveryStatus,
        noteKn:
          'ಅಭಿವೃದ್ಧಿ ಮೋಡ್‌ನಲ್ಲಿ SMS/ಇಮೇಲ್ ವಿತರಣೆ ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ. ಯಾವುದೇ ನೈಜ OTP ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿಲ್ಲ.',
        noteEn:
          'SMS/Email delivery is disabled in development mode. No real OTP was dispatched; production requires an approved gateway.',
      } as const;
    }

    return {
      mobileDeliveryStatus,
      emailDeliveryStatus,
      noteKn: 'ನೋಂದಾಯಿತ ಮೊಬೈಲ್/ಇಮೇಲ್ ವಿಳಾಸಕ್ಕೆ ದೃಢೀಕರಣ ಸೂಚನೆ ರವಾನಿಸಲಾಗಿದೆ.',
      noteEn: 'Verification instructions have been dispatched to the registered contact channel.',
    } as const;
  }

  async registerStudent(
    payload: StudentRegistrationPayload,
    clientIp: string,
    language: 'kn' | 'en' = 'kn'
  ): Promise<RegistrationSubmitResponse> {
    this.assertDbReady();

    const normalizedCode = payload.studentIdentifier?.toUpperCase();
    const satsRefHash = payload.satsRef
      ? hmacSha256Hex(payload.satsRef.toUpperCase(), this.config.dataHashPepper)
      : undefined;

    const isDuplicate = await this.repo.findDuplicate({
      mobileE164: payload.mobileNumber,
      email: payload.email?.toLowerCase(),
      schoolStudentCode: normalizedCode,
      satsRefHash,
    });

    if (isDuplicate) {
      throw new RegistrationError(
        409,
        'REGISTRATION_CONFLICT',
        'An account or registration matching these student details is already on file. Check your registration status or contact the school office.'
      );
    }

    const referenceCode = generateRegistrationReferenceCode();
    const canonicalLookupKey = (normalizedCode || payload.mobileNumber).toUpperCase();
    const identifierHash = hmacSha256Hex(canonicalLookupKey, this.config.dataHashPepper);

    const otpCode = generateNumericOtp(OTP_POLICY.length);
    const otpSalt = generateSaltHex(16);
    const otpHmac = hmacSha256Hex(otpCode, this.config.otpHmacSecret, otpSalt);
    const now = Date.now();
    const otpExpiresAt = new Date(now + OTP_POLICY.ttlSeconds * 1000);
    const resendAvailableAt = new Date(now + OTP_POLICY.resendCooldownSeconds * 1000);
    const ipHash = hmacSha256Hex(clientIp || 'unknown', this.config.dataHashPepper);

    let emailToken: string | undefined;
    let emailTokenHash: string | undefined;
    let emailTokenTargetHash: string | undefined;
    let emailTokenExpiresAt: Date | undefined;

    if (payload.email) {
      emailToken = generateOpaqueToken(32);
      emailTokenHash = hmacSha256Hex(emailToken, this.config.otpHmacSecret);
      emailTokenTargetHash = hmacSha256Hex(payload.email.toLowerCase(), this.config.dataHashPepper);
      emailTokenExpiresAt = new Date(now + OTP_POLICY.emailTokenTtlSeconds * 1000);
    }

    await this.repo.createStudentRegistration({
      referenceCode,
      mobileE164: payload.mobileNumber,
      email: payload.email?.toLowerCase(),
      identifierHash,
      studentName: payload.studentName,
      schoolStudentCode: normalizedCode,
      satsRefHash,
      classGrade: payload.classGrade,
      section: payload.section?.toUpperCase(),
      academicYear: payload.academicYear,
      submittedPayload: {
        guardianName: payload.guardianName,
        guardianRelationship: payload.guardianRelationship,
        guardianMobileHash: hmacSha256Hex(payload.guardianMobileNumber, this.config.dataHashPepper),
        minorGuardianConsent: true,
        classGrade: payload.classGrade,
        academicYear: payload.academicYear,
      },
      otpHmac,
      otpSalt,
      otpExpiresAt,
      resendAvailableAt,
      ipHash,
      emailTokenHash,
      emailTokenTargetHash,
      emailTokenExpiresAt,
    });

    const smsResult = await this.smsProvider.sendOtp({
      recipientMobileE164: payload.mobileNumber,
      purpose: 'register_verify',
      otpCode,
      ttlMinutes: Math.round(OTP_POLICY.ttlSeconds / 60),
      language,
    });

    const emailResult =
      payload.email && emailToken
        ? await this.emailProvider.sendVerification({
            recipientEmail: payload.email.toLowerCase(),
            purpose: 'register_verify',
            verificationToken: emailToken,
            expiresHours: Math.round(OTP_POLICY.emailTokenTtlSeconds / 3600),
            language,
          })
        : undefined;

    return {
      accepted: true,
      referenceCode,
      status: 'pending_contact_verification',
      registrantType: 'student',
      requiresGuardianVerification: true,
      contactVerification: this.buildContactVerificationNote(smsResult, emailResult),
      messageKn:
        'ವಿದ್ಯಾರ್ಥಿ ನೋಂದಣಿ ಅರ್ಜಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ಸಂಪರ್ಕ ದೃಢೀಕರಣ ಹಾಗೂ ಪೋಷಕರ/ಶಾಲಾ ಅನುಮೋದನೆಯ ನಂತರ ಮಾತ್ರ ಪ್ರವೇಶ ಲಭ್ಯವಾಗುತ್ತದೆ.',
      messageEn:
        'Student registration recorded. Portal access remains blocked until contact verification, guardian confirmation, and school approval complete.',
    };
  }

  async registerParent(
    payload: ParentRegistrationPayload,
    clientIp: string,
    language: 'kn' | 'en' = 'kn'
  ): Promise<RegistrationSubmitResponse> {
    this.assertDbReady();

    const isDuplicate = await this.repo.findDuplicate({
      mobileE164: payload.guardianMobileNumber,
      email: payload.guardianEmail?.toLowerCase(),
    });

    if (isDuplicate) {
      throw new RegistrationError(
        409,
        'REGISTRATION_CONFLICT',
        'A guardian account or registration matching this contact is already on file.'
      );
    }

    const referenceCode = generateRegistrationReferenceCode();
    const canonicalLookupKey = payload.guardianMobileNumber.toUpperCase();
    const identifierHash = hmacSha256Hex(canonicalLookupKey, this.config.dataHashPepper);

    const otpCode = generateNumericOtp(OTP_POLICY.length);
    const otpSalt = generateSaltHex(16);
    const otpHmac = hmacSha256Hex(otpCode, this.config.otpHmacSecret, otpSalt);
    const now = Date.now();
    const otpExpiresAt = new Date(now + OTP_POLICY.ttlSeconds * 1000);
    const resendAvailableAt = new Date(now + OTP_POLICY.resendCooldownSeconds * 1000);
    const ipHash = hmacSha256Hex(clientIp || 'unknown', this.config.dataHashPepper);

    let emailToken: string | undefined;
    let emailTokenHash: string | undefined;
    let emailTokenTargetHash: string | undefined;
    let emailTokenExpiresAt: Date | undefined;

    if (payload.guardianEmail) {
      emailToken = generateOpaqueToken(32);
      emailTokenHash = hmacSha256Hex(emailToken, this.config.otpHmacSecret);
      emailTokenTargetHash = hmacSha256Hex(
        payload.guardianEmail.toLowerCase(),
        this.config.dataHashPepper
      );
      emailTokenExpiresAt = new Date(now + OTP_POLICY.emailTokenTtlSeconds * 1000);
    }

    await this.repo.createParentRegistration({
      referenceCode,
      guardianName: payload.guardianName,
      guardianMobileE164: payload.guardianMobileNumber,
      guardianEmail: payload.guardianEmail?.toLowerCase(),
      relationship: payload.relationship,
      studentIdentifier: payload.studentIdentifier.toUpperCase(),
      identifierHash,
      submittedPayload: {
        relationship: payload.relationship,
        studentIdentifierHash: hmacSha256Hex(
          payload.studentIdentifier.toUpperCase(),
          this.config.dataHashPepper
        ),
        classGrade: payload.classGrade,
        academicYear: payload.academicYear,
      },
      otpHmac,
      otpSalt,
      otpExpiresAt,
      resendAvailableAt,
      ipHash,
      emailTokenHash,
      emailTokenTargetHash,
      emailTokenExpiresAt,
    });

    const smsResult = await this.smsProvider.sendOtp({
      recipientMobileE164: payload.guardianMobileNumber,
      purpose: 'register_verify',
      otpCode,
      ttlMinutes: Math.round(OTP_POLICY.ttlSeconds / 60),
      language,
    });

    const emailResult =
      payload.guardianEmail && emailToken
        ? await this.emailProvider.sendVerification({
            recipientEmail: payload.guardianEmail.toLowerCase(),
            purpose: 'register_verify',
            verificationToken: emailToken,
            expiresHours: Math.round(OTP_POLICY.emailTokenTtlSeconds / 3600),
            language,
          })
        : undefined;

    return {
      accepted: true,
      referenceCode,
      status: 'pending_contact_verification',
      registrantType: 'parent_guardian',
      requiresGuardianVerification: true,
      contactVerification: this.buildContactVerificationNote(smsResult, emailResult),
      messageKn:
        'ಪೋಷಕರ/ಪಾಲಕರ ನೋಂದಣಿ ಅರ್ಜಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ವಿದ್ಯಾರ್ಥಿ-ಪೋಷಕ ಸಂಬಂಧವನ್ನು ಶಾಲಾ ಕಚೇರಿ ಪರಿಶೀಲಿಸಿದ ನಂತರವೇ ವಿದ್ಯಾರ್ಥಿ ವಿವರಗಳು ಲಭ್ಯವಾಗುತ್ತವೆ.',
      messageEn:
        'Parent/guardian registration recorded. Access to linked student records remains disabled until contact verification and school office relationship approval.',
    };
  }

  async registerStaff(
    payload: StaffRegistrationPayload,
    clientIp: string,
    language: 'kn' | 'en' = 'kn'
  ): Promise<RegistrationSubmitResponse> {
    this.assertDbReady();

    const normalizedStaffId = payload.officialStaffId.toUpperCase();
    const normalizedEmail = payload.email.toLowerCase();

    const isDuplicate = await this.repo.findDuplicate({
      mobileE164: payload.mobileNumber,
      email: normalizedEmail,
      officialStaffId: normalizedStaffId,
    });

    if (isDuplicate) {
      throw new RegistrationError(
        409,
        'REGISTRATION_CONFLICT',
        'A staff account or registration matching these details is already on file.'
      );
    }

    const referenceCode = generateRegistrationReferenceCode();
    const identifierHash = hmacSha256Hex(normalizedStaffId, this.config.dataHashPepper);

    const otpCode = generateNumericOtp(OTP_POLICY.length);
    const otpSalt = generateSaltHex(16);
    const otpHmac = hmacSha256Hex(otpCode, this.config.otpHmacSecret, otpSalt);
    const now = Date.now();
    const otpExpiresAt = new Date(now + OTP_POLICY.ttlSeconds * 1000);
    const resendAvailableAt = new Date(now + OTP_POLICY.resendCooldownSeconds * 1000);
    const ipHash = hmacSha256Hex(clientIp || 'unknown', this.config.dataHashPepper);

    const emailToken = generateOpaqueToken(32);
    const emailTokenHash = hmacSha256Hex(emailToken, this.config.otpHmacSecret);
    const emailTokenTargetHash = hmacSha256Hex(normalizedEmail, this.config.dataHashPepper);
    const emailTokenExpiresAt = new Date(now + OTP_POLICY.emailTokenTtlSeconds * 1000);

    // Server never allows self-assignment of TEACHER/HEADMASTER/SCHOOL_ADMIN roles at registration
    await this.repo.createStaffRegistration({
      referenceCode,
      fullName: payload.fullName,
      officialStaffId: normalizedStaffId,
      designation: payload.designation,
      departmentOrSubject: payload.departmentOrSubject,
      mobileE164: payload.mobileNumber,
      email: normalizedEmail,
      identifierHash,
      submittedPayload: {
        designation: payload.designation,
        departmentOrSubject: payload.departmentOrSubject,
      },
      otpHmac,
      otpSalt,
      otpExpiresAt,
      resendAvailableAt,
      ipHash,
      emailTokenHash,
      emailTokenTargetHash,
      emailTokenExpiresAt,
    });

    const smsResult = await this.smsProvider.sendOtp({
      recipientMobileE164: payload.mobileNumber,
      purpose: 'register_verify',
      otpCode,
      ttlMinutes: Math.round(OTP_POLICY.ttlSeconds / 60),
      language,
    });

    const emailResult = await this.emailProvider.sendVerification({
      recipientEmail: normalizedEmail,
      purpose: 'register_verify',
      verificationToken: emailToken,
      expiresHours: Math.round(OTP_POLICY.emailTokenTtlSeconds / 3600),
      language,
    });

    return {
      accepted: true,
      referenceCode,
      status: 'pending_contact_verification',
      registrantType: 'staff',
      requiresGuardianVerification: false,
      contactVerification: this.buildContactVerificationNote(smsResult, emailResult),
      messageKn:
        'ಸಿಬ್ಬಂದಿ ನೋಂದಣಿ ಅರ್ಜಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ. ಸಂಪರ್ಕ ದೃಢೀಕರಣ ಹಾಗೂ ಶಾಲಾ ಆಡಳಿತಾಧಿಕಾರಿಗಳ RBAC ಅನುಮೋದನೆಯ ನಂತರವೇ ಸಿಬ್ಬಂದಿ ಪ್ರವೇಶ ದೊರೆಯುತ್ತದೆ.',
      messageEn:
        'Staff registration recorded. No staff or administrative role is assigned until contact verification and authorized school approval complete.',
    };
  }

  async checkRegistrationStatus(
    payload: RegistrationStatusLookupPayload
  ): Promise<RegistrationStatusLookupResponse> {
    this.assertDbReady();

    const record = await this.repo.findByReferenceCode(payload.referenceCode);

    const normalizedMobile = normalizeIndianMobileE164(payload.identifier);
    const candidateIdentifier = (normalizedMobile || payload.identifier).trim().toUpperCase();
    const candidateHash = hmacSha256Hex(candidateIdentifier, this.config.dataHashPepper);

    const matches =
      record !== null && timingSafeHexEqual(record.identifierHash, candidateHash);

    if (!matches || !record) {
      // Anti-enumeration generic response: never confirm whether a reference code or ID exists
      return {
        referenceCode: payload.referenceCode,
        status: 'unavailable',
        requiresSchoolApproval: true,
        messageKn:
          'ಸಲ್ಲಿಸಿದ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ ಮತ್ತು ಗುರುತಿನ ಮಾಹಿತಿಯೊಂದಿಗೆ ಹೊಂದಾಣಿಕೆಯಾಗುವ ಸ್ಥಿತಿ ಲಭ್ಯವಿಲ್ಲ ಅಥವಾ ಪರಿಶೀಲಿಸಲಾಗಲಿಲ್ಲ.',
        messageEn:
          'No matching registration status could be verified for the provided reference code and identifier.',
        nextStepKn:
          'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆಯನ್ನು ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಸಹಾಯಕ್ಕಾಗಿ ಶಾಲಾ ಕಚೇರಿಯನ್ನು ಸಂಪರ್ಕಿಸಿ.',
        nextStepEn:
          'Verify your reference code and registered identifier, or contact the school office for assistance.',
      };
    }

    const localized = STATUS_MESSAGES[record.status];
    return {
      referenceCode: record.referenceCode,
      status: record.status,
      requiresSchoolApproval: record.status !== 'approved',
      messageKn: localized.messageKn,
      messageEn: localized.messageEn,
      nextStepKn: localized.nextStepKn,
      nextStepEn: localized.nextStepEn,
    };
  }
}

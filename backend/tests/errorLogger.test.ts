import type http from 'node:http';
import express from 'express';
import { afterEach, describe, expect, it } from 'vitest';
import { createApiApp } from '../app.ts';
import type { ServerConfig } from '../config/env.ts';
import type { AuthSessionResolver } from '../middleware/auth.guard.ts';
import type { RegistrationRepository } from '../modules/registration/registration.repository.ts';
import {
  ErrorLogger,
  redactPiiFromString,
  type ErrorLogSink,
  type StructuredErrorLogEntry,
} from '../utils/errorLogger.ts';

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

class MemoryErrorSink implements ErrorLogSink {
  readonly entries: StructuredErrorLogEntry[] = [];

  write(entry: StructuredErrorLogEntry): void {
    this.entries.push(entry);
  }
}

function createFailingRepo(): RegistrationRepository {
  const createPgLikeFailure = () => {
    const err = new Error(
      'insert failed for student@example.org mobile +91 98765 43210 postgres://admin:supersecret@10.0.0.5:5432/school_db'
    ) as Error & {
      code?: string;
      detail?: string;
      parameters?: unknown[];
    };
    err.name = 'DatabaseError';
    err.code = '23505';
    err.detail = 'Key (mobile_e164)=(+919876543210) already exists for Ramesh Kumar.';
    err.parameters = ['Ramesh Kumar', '+919876543210', 'student@example.org'];
    return err;
  };

  return {
    isReady: () => true,
    findDuplicate: async () => {
      throw createPgLikeFailure();
    },
    createStudentRegistration: async () => {
      throw createPgLikeFailure();
    },
    createParentRegistration: async () => {
      throw createPgLikeFailure();
    },
    createStaffRegistration: async () => {
      throw createPgLikeFailure();
    },
    findByReferenceCode: async () => {
      throw createPgLikeFailure();
    },
  };
}

async function startServer(app: express.Express) {
  const server = await new Promise<http.Server>((resolve) => {
    const srv = app.listen(0, '127.0.0.1', () => resolve(srv));
  });
  const addr = server.address();
  if (!addr || typeof addr === 'string') {
    throw new Error('Failed to bind ephemeral port.');
  }
  return { server, baseUrl: `http://127.0.0.1:${addr.port}` };
}

describe('Centralized PII-Safe Error Logger & app.ts INTERNAL_ERROR Integration', () => {
  const activeServers: http.Server[] = [];

  afterEach(async () => {
    while (activeServers.length > 0) {
      const srv = activeServers.pop();
      if (srv) {
        await new Promise<void>((resolve) => srv.close(() => resolve()));
      }
    }
  });

  it('scrubs PII, secrets, Aadhaar-like numbers, tokens, and PG details from error logs', () => {
    const sink = new MemoryErrorSink();
    const logger = new ErrorLogger({ config: TEST_CONFIG, sink });

    const rootCause: Error & { cause?: unknown } = new Error(
      'Connection failed to postgresql://sqluser:secretPass@10.1.2.3:5432/ghs for bearer Bearer abcdef123456'
    );
    const circularErr: Error & { cause?: unknown; code?: string; detail?: string } = new Error(
      'Duplicate contact +91 98765 43210 / parent.user@karnataka.gov.in / 1234 5678 9012 / GHS-REG-2026-DEADBEEF / otp=445566'
    );
    circularErr.code = '23505';
    circularErr.detail = 'Key (email)=(parent.user@karnataka.gov.in) already exists.';
    circularErr.cause = rootCause;
    rootCause.cause = circularErr;

    const errorId = logger.logError(circularErr, {
      operation: 'unit_test_scrubbing',
      statusCode: 500,
      metadata: {
        classGrade: 9,
        studentName: 'Sensitive Name',
        guardianEmail: 'parent.user@karnataka.gov.in',
        nested: {
          note: 'Reachable at 9876543210',
          secretToken: 'should-redact',
        },
      },
    });

    expect(errorId).toMatch(/^ERR-[A-F0-9]{12}$/);
    expect(sink.entries).toHaveLength(1);

    const serialized = JSON.stringify(sink.entries[0]);
    expect(serialized).not.toContain('98765 43210');
    expect(serialized).not.toContain('9876543210');
    expect(serialized).not.toContain('parent.user@karnataka.gov.in');
    expect(serialized).not.toContain('1234 5678 9012');
    expect(serialized).not.toContain('secretPass');
    expect(serialized).not.toContain('abcdef123456');
    expect(serialized).not.toContain('DEADBEEF');
    expect(serialized).not.toContain('445566');
    expect(serialized).not.toContain('Sensitive Name');
    expect(serialized).not.toContain('should-redact');

    expect(sink.entries[0].error.sqlState).toBe('23505');
    expect(sink.entries[0].metadata).toEqual({
      classGrade: 9,
      studentName: '[REDACTED]',
      guardianEmail: '[REDACTED]',
      nested: {
        note: 'Reachable at [REDACTED_PHONE]',
        secretToken: '[REDACTED]',
      },
    });
    expect(sink.entries[0].error.cause?.cause?.name).toBe('CircularError');

    expect(redactPiiFromString('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NSJ9.signatureHere123')).toBe(
      '[REDACTED_JWT]'
    );
  });

  it('integrates ErrorLogger with all INTERNAL_ERROR responses in backend/app.ts and returns errorId', async () => {
    const sink = new MemoryErrorSink();
    const errorLogger = new ErrorLogger({ config: TEST_CONFIG, sink });

    const app = createApiApp({
      config: TEST_CONFIG,
      registrationRepo: createFailingRepo(),
      errorLogger,
    });
    const { server, baseUrl } = await startServer(app);
    activeServers.push(server);

    const endpoints: Array<{ path: string; body: Record<string, unknown>; op: string }> = [
      {
        path: '/api/v1/auth/register/student',
        op: 'register_student',
        body: {
          studentName: 'Asha Student',
          classGrade: 9,
          academicYear: '2025-26',
          mobileNumber: '9876543210',
          email: 'asha.student@example.org',
          guardianName: 'Lakshmi Guardian',
          guardianRelationship: 'mother',
          guardianMobileNumber: '9876543211',
          minorGuardianConsent: true,
        },
      },
      {
        path: '/api/v1/auth/register/parent',
        op: 'register_parent',
        body: {
          guardianName: 'Lakshmi Guardian',
          relationship: 'mother',
          guardianMobileNumber: '9876543211',
          studentIdentifier: 'DVG2025001',
          studentName: 'Asha Student',
          classGrade: 9,
          academicYear: '2025-26',
        },
      },
      {
        path: '/api/v1/auth/register/staff',
        op: 'register_staff',
        body: {
          fullName: 'Teacher Mohan',
          officialStaffId: 'KGID9988',
          designation: 'Assistant Master',
          departmentOrSubject: 'Science',
          mobileNumber: '9845011223',
          email: 'mohan.teacher@karnataka.gov.in',
        },
      },
      {
        path: '/api/v1/auth/registration-status',
        op: 'registration_status_lookup',
        body: {
          referenceCode: 'GHS-REG-2026-ABCDEF12',
          identifier: '9876543210',
        },
      },
    ];

    for (const [idx, ep] of endpoints.entries()) {
      const res = await fetch(`${baseUrl}${ep.path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-Id': `req-corr-${idx + 1}`,
        },
        body: JSON.stringify(ep.body),
      });

      expect(res.status).toBe(500);
      const json = (await res.json()) as {
        errorCode: string;
        errorId: string;
        message: string;
      };
      expect(json.errorCode).toBe('INTERNAL_ERROR');
      expect(json.errorId).toMatch(/^ERR-[A-F0-9]{12}$/);
      expect(json.message).not.toContain('postgres');
      expect(json.message).not.toContain('9876543210');

      const entry = sink.entries[idx];
      expect(entry.errorId).toBe(json.errorId);
      expect(entry.operation).toBe(ep.op);
      expect(entry.statusCode).toBe(500);
      expect(entry.http?.method).toBe('POST');
      expect(entry.http?.path).toBe(ep.path);
      expect(entry.http?.requestId).toBe(`req-corr-${idx + 1}`);
      expect(entry.http?.clientIpHash).toMatch(/^[a-f0-9]{16}$/);

      const dumped = JSON.stringify(entry);
      expect(dumped).not.toContain('127.0.0.1');
      expect(dumped).not.toContain('9876543210');
      expect(dumped).not.toContain('98765 43210');
      expect(dumped).not.toContain('Ramesh Kumar');
      expect(dumped).not.toContain('Asha Student');
      expect(dumped).not.toContain('Lakshmi Guardian');
      expect(dumped).not.toContain('Teacher Mohan');
      expect(dumped).not.toContain('student@example.org');
      expect(dumped).not.toContain('supersecret');
    }
  });

  it('catches unexpected middleware/route errors and auth failures without leaking PII or breaking 400 JSON errors', async () => {
    const sink = new MemoryErrorSink();
    const errorLogger = new ErrorLogger({ config: TEST_CONFIG, sink });

    const failingAuthResolver: AuthSessionResolver = {
      resolveFromRequest: async () => {
        throw new Error('Firebase token invalid for staff.user@karnataka.gov.in Bearer tok_live_999');
      },
    };

    const app = createApiApp({
      config: TEST_CONFIG,
      errorLogger,
      authResolver: failingAuthResolver,
      rateLimitStore: {
        consume: async () => {
          throw new Error('Redis timeout mentioning 9988776655 and parent@example.com');
        },
      },
    });

    const { server, baseUrl } = await startServer(app);
    activeServers.push(server);

    // 1. Auth resolver failure logs warn without PII and returns 401
    const authRes = await fetch(`${baseUrl}/api/v1/student/profile`, {
      headers: { Authorization: 'Bearer some-token' },
    });
    expect(authRes.status).toBe(401);
    expect(sink.entries).toHaveLength(1);
    expect(sink.entries[0].level).toBe('warn');
    expect(sink.entries[0].operation).toBe('auth_session_verification');
    expect(JSON.stringify(sink.entries[0])).not.toContain('staff.user@karnataka.gov.in');
    expect(JSON.stringify(sink.entries[0])).not.toContain('tok_live_999');

    // 2. Malformed JSON yields 400 INVALID_JSON cleanly
    const badJsonRes = await fetch(`${baseUrl}/api/v1/auth/register/student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"bad":',
    });
    expect(badJsonRes.status).toBe(400);
    const badJsonBody = (await badJsonRes.json()) as { errorCode: string };
    expect(badJsonBody.errorCode).toBe('INVALID_JSON');

    // 3. Unhandled async middleware crash inside router flows into createErrorHandlerMiddleware
    const crashRes = await fetch(`${baseUrl}/api/v1/auth/register/student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    expect(crashRes.status).toBe(500);
    const crashBody = (await crashRes.json()) as { errorCode: string; errorId: string };
    expect(crashBody.errorCode).toBe('INTERNAL_ERROR');
    expect(crashBody.errorId).toMatch(/^ERR-[A-F0-9]{12}$/);
    const crashLog = sink.entries[sink.entries.length - 1];
    expect(crashLog.errorId).toBe(crashBody.errorId);
    expect(crashLog.operation).toBe('unhandled_express_error');
    expect(JSON.stringify(crashLog)).not.toContain('9988776655');
    expect(JSON.stringify(crashLog)).not.toContain('parent@example.com');
  });
});

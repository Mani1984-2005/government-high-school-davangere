import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import type { ServerConfig } from '../config/env.ts';
import type { AuthenticatedRequest } from '../middleware/auth.guard.ts';
import { hmacSha256Hex } from './crypto.ts';

export type LogSeverity = 'warn' | 'error';

export interface SanitizedErrorDetail {
  name: string;
  message: string;
  code?: string;
  errno?: string | number;
  syscall?: string;
  sqlState?: string;
  stackFrames?: string[];
  cause?: SanitizedErrorDetail;
}

export interface StructuredErrorLogEntry {
  timestamp: string;
  level: LogSeverity;
  errorId: string;
  environment: ServerConfig['nodeEnv'];
  operation: string;
  statusCode?: number;
  http?: {
    method: string;
    path: string;
    requestId?: string;
    clientIpHash?: string;
  };
  actor?: {
    userId: string;
    accountStatus?: string;
    rolesCount: number;
  };
  error: SanitizedErrorDetail;
  metadata?: Record<string, unknown>;
}

export interface ErrorLogContext {
  operation: string;
  req?: Request;
  statusCode?: number;
  severity?: LogSeverity;
  metadata?: Record<string, unknown>;
}

export interface ErrorLogSink {
  write(entry: StructuredErrorLogEntry): void;
}

export class ConsoleJsonErrorSink implements ErrorLogSink {
  write(entry: StructuredErrorLogEntry): void {
    console.error(JSON.stringify(entry));
  }
}

const SENSITIVE_KEY_PATTERNS = [
  'email',
  'mobile',
  'phone',
  'tel',
  'contact',
  'name',
  'student',
  'guardian',
  'parent',
  'staff',
  'aadhaar',
  'uid',
  'sats',
  'kgid',
  'address',
  'dob',
  'birth',
  'password',
  'passwd',
  'secret',
  'token',
  'otp',
  'pin',
  'cookie',
  'authorization',
  'auth',
  'bearer',
  'session',
  'pepper',
  'remoteaddress',
  'clientip',
  'headers',
  'body',
  'payload',
  'query',
  'params',
  'detail',
  'parameters',
  'sql',
  'statement',
  'connectionstring',
];

const MAX_MESSAGE_LENGTH = 500;
const MAX_STACK_FRAMES = 8;
const MAX_METADATA_DEPTH = 3;
const MAX_METADATA_KEYS = 20;

function isSensitiveKey(key: string): boolean {
  const lower = key.toLowerCase();
  if (lower === 'ip' || lower === 'key' || lower === 'apikey' || lower === 'api_key') {
    return true;
  }
  return SENSITIVE_KEY_PATTERNS.some((pattern) => lower.includes(pattern));
}

export function redactPiiFromString(input: string): string {
  let out = input;

  // Credentials embedded in connection URLs
  out = out.replace(
    /(postgres(?:ql)?|mysql|redis|mongodb(?:\+srv)?):\/\/[^:\s]+:[^@\s]+@[^\s]+/gi,
    '$1://[REDACTED_CREDENTIALS]'
  );

  // HTTP auth headers (skip matching the English word "bearer"/"basic" followed by another "Bearer ")
  out = out.replace(
    /\b(Bearer|Basic)\s+(?!(?:Bearer|Basic)\b)[A-Za-z0-9\-._~+/]+=*/gi,
    '$1 [REDACTED]'
  );

  // JWT tokens
  out = out.replace(/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g, '[REDACTED_JWT]');

  // Email addresses
  out = out.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g, '[REDACTED_EMAIL]');

  // Postgres constraint detail fragments: Key (column)=(value)
  out = out.replace(/Key\s*\([^)]+\)\s*=\s*\([^)]+\)/gi, 'Key ([REDACTED])=([REDACTED])');

  // Aadhaar-like 12-digit numbers (grouped or contiguous)
  out = out.replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, '[REDACTED_ID]');

  // Indian mobile numbers (+91 / 91 / 10-digit starting 6-9, with optional 5-5 split)
  out = out.replace(/(?:\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/g, '[REDACTED_PHONE]');

  // Registration reference codes (avoid persisting trackable applicant references in logs)
  out = out.replace(/\bGHS-REG-\d{4}-[A-F0-9]{8}\b/gi, 'GHS-REG-[REDACTED]');

  // Key=value / key: value inline secrets/OTPs
  out = out.replace(
    /\b(otp|token|password|passwd|secret|pin|api[_-]?key|session)\s*[:=]\s*(['"]?)[^\s,;'"`]+\2/gi,
    '$1=[REDACTED]'
  );

  return out;
}

function sanitizeMetadataValue(
  value: unknown,
  depth: number,
  seen: WeakSet<object>
): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === 'boolean' || typeof value === 'number') {
    return Number.isFinite(value) || typeof value === 'boolean' ? value : String(value);
  }
  if (typeof value === 'string') {
    const trimmed = value.length > 240 ? `${value.slice(0, 240)}...` : value;
    return redactPiiFromString(trimmed);
  }
  if (typeof value !== 'object') {
    return String(value);
  }
  if (seen.has(value)) {
    return '[Circular]';
  }
  if (depth >= MAX_METADATA_DEPTH) {
    return '[Truncated]';
  }
  seen.add(value);

  if (Array.isArray(value)) {
    return value.slice(0, 10).map((item) => sanitizeMetadataValue(item, depth + 1, seen));
  }

  const sanitized: Record<string, unknown> = {};
  const entries = Object.entries(value as Record<string, unknown>).slice(0, MAX_METADATA_KEYS);
  for (const [k, v] of entries) {
    if (isSensitiveKey(k)) {
      sanitized[k] = '[REDACTED]';
    } else {
      sanitized[k] = sanitizeMetadataValue(v, depth + 1, seen);
    }
  }
  return sanitized;
}

function sanitizeErrorObject(
  err: unknown,
  depth = 0,
  seen = new WeakSet<object>()
): SanitizedErrorDetail {
  if (err === null || err === undefined) {
    return { name: 'UnknownError', message: 'An unexpected error occurred.' };
  }

  if (typeof err !== 'object') {
    return {
      name: 'NonErrorThrown',
      message: redactPiiFromString(String(err)).slice(0, MAX_MESSAGE_LENGTH),
    };
  }

  if (seen.has(err)) {
    return { name: 'CircularError', message: '[Circular error cause]' };
  }
  seen.add(err);

  const errRecord = err as {
    name?: unknown;
    message?: unknown;
    code?: unknown;
    errno?: unknown;
    syscall?: unknown;
    stack?: unknown;
    cause?: unknown;
  };

  const name =
    typeof errRecord.name === 'string' && errRecord.name.trim() ? errRecord.name.trim() : 'Error';

  const rawMessage =
    typeof errRecord.message === 'string' && errRecord.message.trim()
      ? errRecord.message
      : 'Unexpected failure without error message.';
  const message = redactPiiFromString(rawMessage).slice(0, MAX_MESSAGE_LENGTH);

  const detail: SanitizedErrorDetail = { name, message };

  if (typeof errRecord.code === 'string' || typeof errRecord.code === 'number') {
    const codeStr = String(errRecord.code);
    // Distinguish 5-char SQLSTATE codes cleanly while preserving system codes like ECONNREFUSED
    if (/^[0-9A-Z]{5}$/.test(codeStr)) {
      detail.sqlState = codeStr;
    } else {
      detail.code = codeStr.slice(0, 64);
    }
  }

  if (typeof errRecord.errno === 'string' || typeof errRecord.errno === 'number') {
    detail.errno = errRecord.errno;
  }

  if (typeof errRecord.syscall === 'string' && errRecord.syscall.trim()) {
    detail.syscall = errRecord.syscall.trim().slice(0, 32);
  }

  if (typeof errRecord.stack === 'string' && errRecord.stack.trim()) {
    const frames = errRecord.stack
      .split('\n')
      .slice(1, MAX_STACK_FRAMES + 1)
      .map((line) => redactPiiFromString(line.trim()))
      .filter(Boolean);
    if (frames.length > 0) {
      detail.stackFrames = frames;
    }
  }

  if (errRecord.cause !== undefined && depth < 3) {
    detail.cause = sanitizeErrorObject(errRecord.cause, depth + 1, seen);
  }

  return detail;
}

function sanitizeRequestPath(req: Request): string {
  const combined = `${req.baseUrl || ''}${req.path || '/'}`;
  return redactPiiFromString(combined).slice(0, 200);
}

function sanitizeRequestId(req: Request): string | undefined {
  const headerVal = req.headers['x-request-id'];
  const raw = Array.isArray(headerVal) ? headerVal[0] : headerVal;
  if (typeof raw !== 'string') return undefined;
  const cleaned = raw.trim();
  if (!/^[A-Za-z0-9._-]{4,64}$/.test(cleaned)) {
    return undefined;
  }
  return cleaned;
}

export class ErrorLogger {
  private readonly config: Pick<ServerConfig, 'nodeEnv' | 'dataHashPepper'>;
  private readonly sink: ErrorLogSink;

  constructor(deps: {
    config: Pick<ServerConfig, 'nodeEnv' | 'dataHashPepper'>;
    sink?: ErrorLogSink;
  }) {
    this.config = deps.config;
    this.sink = deps.sink ?? new ConsoleJsonErrorSink();
  }

  logError(err: unknown, context: ErrorLogContext): string {
    const errorId = `ERR-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

    const entry: StructuredErrorLogEntry = {
      timestamp: new Date().toISOString(),
      level: context.severity ?? 'error',
      errorId,
      environment: this.config.nodeEnv,
      operation: context.operation,
      ...(context.statusCode !== undefined ? { statusCode: context.statusCode } : {}),
      error: sanitizeErrorObject(err),
    };

    if (context.req) {
      const rawIp = context.req.ip || context.req.socket?.remoteAddress;
      const clientIpHash = rawIp
        ? hmacSha256Hex(rawIp, this.config.dataHashPepper).slice(0, 16)
        : undefined;
      const requestId = sanitizeRequestId(context.req);

      entry.http = {
        method: context.req.method,
        path: sanitizeRequestPath(context.req),
        ...(requestId ? { requestId } : {}),
        ...(clientIpHash ? { clientIpHash } : {}),
      };

      const authReq = context.req as AuthenticatedRequest;
      if (authReq.auth?.userId) {
        entry.actor = {
          userId: authReq.auth.userId,
          accountStatus: authReq.auth.accountStatus,
          rolesCount: authReq.auth.roles.length,
        };
      }
    }

    if (context.metadata && Object.keys(context.metadata).length > 0) {
      entry.metadata = sanitizeMetadataValue(
        context.metadata,
        0,
        new WeakSet<object>()
      ) as Record<string, unknown>;
    }

    this.sink.write(entry);
    return errorId;
  }
}

export function createErrorLogger(
  config: Pick<ServerConfig, 'nodeEnv' | 'dataHashPepper'>,
  sink?: ErrorLogSink
): ErrorLogger {
  return new ErrorLogger({ config, sink });
}

export function sendInternalErrorResponse(
  errorLogger: ErrorLogger,
  req: Request,
  res: Response,
  err: unknown,
  options: {
    operation: string;
    publicMessage: string;
    metadata?: Record<string, unknown>;
  }
): string {
  const errorId = errorLogger.logError(err, {
    operation: options.operation,
    req,
    statusCode: 500,
    severity: 'error',
    metadata: options.metadata,
  });

  if (!res.headersSent) {
    res.status(500).json({
      errorCode: 'INTERNAL_ERROR',
      errorId,
      message: options.publicMessage,
    });
  }

  return errorId;
}

export function createErrorHandlerMiddleware(errorLogger: ErrorLogger) {
  return (err: unknown, req: Request, res: Response, next: NextFunction): void => {
    if (res.headersSent) {
      next(err);
      return;
    }

    // Handle malformed JSON request bodies cleanly as 400 client errors
    if (
      err instanceof SyntaxError &&
      'status' in err &&
      (err as { status?: number }).status === 400
    ) {
      res.status(400).json({
        errorCode: 'INVALID_JSON',
        message: 'Malformed JSON request payload.',
      });
      return;
    }

    sendInternalErrorResponse(errorLogger, req, res, err, {
      operation: 'unhandled_express_error',
      publicMessage: 'An unexpected server error occurred while processing your request.',
    });
  };
}

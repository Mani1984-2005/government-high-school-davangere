import type { NextFunction, Request, Response } from 'express';
import type { PermissionCode, RbacRoleCode, RegistrationStatus } from '../../shared/constants/roles.ts';
import type { ErrorLogger } from '../utils/errorLogger.ts';

export interface AuthenticatedContext {
  userId: string;
  uid?: string;
  accountStatus: RegistrationStatus;
  roles: RbacRoleCode[];
  permissions: PermissionCode[];
  mfaVerified: boolean;
}

export interface AuthenticatedRequest extends Request {
  auth?: AuthenticatedContext;
}

export interface AuthSessionResolver {
  resolveFromRequest(req: Request): Promise<AuthenticatedContext | null>;
}

function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  if (!cookieHeader) return {};
  const result: Record<string, string> = {};
  for (const pair of cookieHeader.split(';')) {
    const idx = pair.indexOf('=');
    if (idx <= 0) continue;
    const key = pair.slice(0, idx).trim();
    const val = pair.slice(idx + 1).trim();
    if (key) {
      result[key] = decodeURIComponent(val);
    }
  }
  return result;
}

export function extractBearerOrCookieToken(req: Request): {
  bearerToken?: string;
  sessionCookie?: string;
} {
  const authHeader = req.headers.authorization;
  const bearerToken =
    typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
      ? authHeader.slice('Bearer '.length).trim()
      : undefined;

  const cookies = parseCookies(req.headers.cookie);
  const sessionCookie = cookies.ghs_session || undefined;

  return { bearerToken, sessionCookie };
}

export function createRequireAuth(
  resolver: AuthSessionResolver,
  errorLogger?: ErrorLogger
) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const context = await resolver.resolveFromRequest(req);
      if (!context) {
        res.status(401).json({
          errorCode: 'AUTH_REQUIRED',
          message: 'Authentication is required to access this portal resource.',
        });
        return;
      }

      if (context.accountStatus !== 'approved') {
        res.status(403).json({
          errorCode: 'ACCOUNT_NOT_APPROVED',
          accountStatus: context.accountStatus,
          message:
            'Your account is not approved for private portal access. Pending verification, school approval, or suspended accounts cannot access this resource.',
        });
        return;
      }

      req.auth = context;
      next();
    } catch (error) {
      errorLogger?.logError(error, {
        operation: 'auth_session_verification',
        req,
        statusCode: 401,
        severity: 'warn',
      });
      res.status(401).json({
        errorCode: 'INVALID_AUTHENTICATION',
        message: 'Unable to verify authentication session.',
      });
    }
  };
}

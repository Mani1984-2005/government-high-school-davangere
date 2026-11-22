import type { NextFunction, Response } from 'express';
import {
  PRIVILEGED_ROLES,
  type PermissionCode,
  type RbacRoleCode,
} from '../../shared/constants/roles.ts';
import type { AuthenticatedRequest } from './auth.guard.ts';

export function requireRoles(...allowedRoles: RbacRoleCode[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const auth = req.auth;
    if (!auth) {
      res.status(401).json({
        errorCode: 'AUTH_REQUIRED',
        message: 'Authentication is required.',
      });
      return;
    }

    if (auth.accountStatus !== 'approved') {
      res.status(403).json({
        errorCode: 'ACCOUNT_NOT_APPROVED',
        message: 'Only approved accounts may access this resource.',
      });
      return;
    }

    const hasRole = allowedRoles.some((role) => auth.roles.includes(role));
    if (!hasRole) {
      res.status(403).json({
        errorCode: 'FORBIDDEN_ROLE',
        message: 'You do not have the authorized role required for this action.',
      });
      return;
    }

    const requiresMfa = allowedRoles.some((role) => PRIVILEGED_ROLES.includes(role));
    if (requiresMfa && !auth.mfaVerified) {
      res.status(403).json({
        errorCode: 'MFA_REQUIRED',
        message: 'Stronger MFA verification is mandatory for privileged staff/admin access.',
      });
      return;
    }

    next();
  };
}

export function requirePermissions(...requiredPermissions: PermissionCode[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const auth = req.auth;
    if (!auth) {
      res.status(401).json({
        errorCode: 'AUTH_REQUIRED',
        message: 'Authentication is required.',
      });
      return;
    }

    const hasAll = requiredPermissions.every((perm) => auth.permissions.includes(perm));
    if (!hasAll) {
      res.status(403).json({
        errorCode: 'FORBIDDEN_PERMISSION',
        message: 'You do not have the required server permission for this resource.',
      });
      return;
    }

    next();
  };
}

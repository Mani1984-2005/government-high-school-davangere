import type { Request } from 'express';
import { and, eq, gt, isNull } from 'drizzle-orm';
import { adminAuth } from '../lib/firebase-admin.ts';
import { db, isDatabaseConfigured } from '../../src/db/index.ts';
import {
  permissions,
  rolePermissions,
  roles,
  sessions,
  userRoles,
  users,
} from '../../src/db/schema.ts';
import { getServerConfig } from '../config/env.ts';
import { hmacSha256Hex } from '../utils/crypto.ts';
import type {
  AuthSessionResolver,
  AuthenticatedContext,
} from '../middleware/auth.guard.ts';
import { extractBearerOrCookieToken } from '../middleware/auth.guard.ts';
import type { PermissionCode, RbacRoleCode, RegistrationStatus } from '../../shared/constants/roles.ts';

export class DbAuthSessionResolver implements AuthSessionResolver {
  async resolveFromRequest(req: Request): Promise<AuthenticatedContext | null> {
    if (!isDatabaseConfigured()) {
      return null;
    }

    const { bearerToken, sessionCookie } = extractBearerOrCookieToken(req);
    const config = getServerConfig();

    // 1. Check HttpOnly session cookie stored as HMAC hash in PostgreSQL
    if (sessionCookie) {
      const tokenHash = hmacSha256Hex(sessionCookie, config.sessionSecret);
      const now = new Date();
      const rows = await db
        .select({
          userId: users.id,
          uid: users.uid,
          accountStatus: users.accountStatus,
          mfaVerifiedAt: sessions.mfaVerifiedAt,
        })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(
          and(
            eq(sessions.tokenHash, tokenHash),
            isNull(sessions.revokedAt),
            gt(sessions.expiresAt, now),
            isNull(users.deletedAt)
          )
        )
        .limit(1);

      if (rows.length === 0) {
        return null;
      }

      return this.loadUserRbacContext(
        rows[0].userId,
        rows[0].uid ?? undefined,
        rows[0].accountStatus as RegistrationStatus,
        Boolean(rows[0].mfaVerifiedAt)
      );
    }

    // 2. Fallback: Firebase ID token verification when explicitly passed as Bearer header
    if (bearerToken) {
      const decoded = await adminAuth.verifyIdToken(bearerToken);
      const userRows = await db
        .select()
        .from(users)
        .where(and(eq(users.uid, decoded.uid), isNull(users.deletedAt)))
        .limit(1);

      if (userRows.length === 0) {
        return null;
      }

      return this.loadUserRbacContext(
        userRows[0].id,
        userRows[0].uid ?? undefined,
        userRows[0].accountStatus as RegistrationStatus,
        false
      );
    }

    return null;
  }

  private async loadUserRbacContext(
    userId: string,
    uid: string | undefined,
    accountStatus: RegistrationStatus,
    mfaVerified: boolean
  ): Promise<AuthenticatedContext> {
    const roleRows = await db
      .select({
        roleCode: roles.code,
        permissionCode: permissions.code,
      })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .leftJoin(rolePermissions, eq(roles.id, rolePermissions.roleId))
      .leftJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
      .where(and(eq(userRoles.userId, userId), isNull(userRoles.revokedAt)));

    const assignedRoles = Array.from(
      new Set(roleRows.map((r) => r.roleCode as RbacRoleCode))
    );
    const assignedPermissions = Array.from(
      new Set(
        roleRows
          .map((r) => r.permissionCode)
          .filter((p): p is PermissionCode => Boolean(p))
      )
    );

    return {
      userId,
      uid,
      accountStatus,
      roles: assignedRoles,
      permissions: assignedPermissions,
      mfaVerified,
    };
  }
}

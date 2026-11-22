import { db } from './index.ts';
import { permissions, rolePermissions, roles, users } from './schema.ts';
import {
  PERMISSION_CODES,
  PRIVILEGED_ROLES,
  RBAC_ROLES,
  ROLE_PERMISSION_MATRIX,
} from '../../shared/constants/roles.ts';

const ROLE_LABELS: Record<string, { kn: string; en: string }> = {
  STUDENT: { kn: 'ವಿದ್ಯಾರ್ಥಿ', en: 'Student' },
  PARENT_GUARDIAN: { kn: 'ಪೋಷಕರು / ಪಾಲಕರು', en: 'Parent / Guardian' },
  TEACHER: { kn: 'ಶಿಕ್ಷಕರು', en: 'Teacher' },
  HEADMASTER: { kn: 'ಮುಖ್ಯ ಶಿಕ್ಷಕರು', en: 'Headmaster' },
  SCHOOL_ADMIN: { kn: 'ಶಾಲಾ ಆಡಳಿತಾಧಿಕಾರಿ', en: 'School Administrator' },
  DATA_ENTRY_OPERATOR: { kn: 'ದತ್ತಾಂಶ ನಮೂದು ಸಿಬ್ಬಂದಿ', en: 'Data Entry Operator' },
  AUDITOR: { kn: 'ಲೆಕ್ಕಪರಿಶೋಧಕರು', en: 'Auditor' },
};

// Safely upsert a Firebase Auth linked account without unique constraint race conditions
export async function getOrCreateFirebaseUser(uid: string, email: string, fallbackMobile = 'UNVERIFIED') {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        email,
        primaryMobileE164: fallbackMobile,
        accountStatus: 'pending_school_approval',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error('Failed to sync authenticated user record:', error);
    throw new Error('Unable to synchronize user record.', { cause: error });
  }
}

// Idempotently ensure canonical RBAC roles and permissions exist when needed
export async function ensureRbacCatalog(): Promise<void> {
  try {
    for (const code of RBAC_ROLES) {
      const label = ROLE_LABELS[code] ?? { kn: code, en: code };
      await db
        .insert(roles)
        .values({
          code,
          nameKn: label.kn,
          nameEn: label.en,
          isPrivileged: PRIVILEGED_ROLES.includes(code),
        })
        .onConflictDoNothing({ target: roles.code });
    }

    for (const permCode of PERMISSION_CODES) {
      await db
        .insert(permissions)
        .values({
          code: permCode,
          description: `Permission: ${permCode}`,
        })
        .onConflictDoNothing({ target: permissions.code });
    }

    const allRoles = await db.select().from(roles);
    const allPerms = await db.select().from(permissions);
    const roleMap = new Map(allRoles.map((r) => [r.code, r.id]));
    const permMap = new Map(allPerms.map((p) => [p.code, p.id]));

    for (const [roleCode, permsForRole] of Object.entries(ROLE_PERMISSION_MATRIX)) {
      const roleId = roleMap.get(roleCode);
      if (!roleId) continue;
      for (const permCode of permsForRole) {
        const permissionId = permMap.get(permCode);
        if (!permissionId) continue;
        await db
          .insert(rolePermissions)
          .values({ roleId, permissionId })
          .onConflictDoNothing();
      }
    }
  } catch (error) {
    console.error('Failed to synchronize RBAC catalog:', error);
    throw new Error('Database catalog sync failed.', { cause: error });
  }
}

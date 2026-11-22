# Phase 5 Implementation Progress

**Current Milestone Completed:** Milestone 2 — Backend Foundation, Database Schema, and Self-Registration  
**Date:** 2026-11-22  
**Stack:** React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + Express 5 + Cloud SQL PostgreSQL + Drizzle ORM + Zod + Vitest

---

## 1. Milestone 2 Deliverables Completed

- **Cloud SQL PostgreSQL Provisioned & Migrated:**
  - Provisioned Cloud SQL PostgreSQL instance (`ai-studio-4b2da1ae`, region `asia-southeast1`) and OAuth/Firebase config (`firebase-applet-config.json`).
  - Defined all **19 normalized PostgreSQL tables** in `src/db/schema.ts`, configured Drizzle Kit (`src/db/drizzle.config.ts`) and lazy Object-Method pool (`src/db/index.ts`), generated versioned migration (`drizzle/0000_phase5_initial.sql`), applied schema to Cloud SQL (`UpdateSchema`), and verified all 19 tables against `information_schema.columns`.
- **Express Backend Foundation (`server.ts` & `backend/`):**
  - Integrated Express 5 server (`server.ts`) mounting `vite.middlewares` on port `3000` in development and `dist/` SPA fallback in production without altering public website routing.
  - Added `backend/app.ts`, security headers & strict CORS allowlist (`backend/middleware/securityHeaders.ts`), server-side auth & approved-account check (`backend/middleware/auth.guard.ts`), RBAC role/permission/MFA guard (`backend/middleware/rbac.guard.ts`), and Cloud SQL session/Firebase token resolver (`backend/middleware/sessionResolver.ts`).
- **Provider Interfaces (Isolated Development Mode):**
  - Created `SmsProvider` / `DisabledDevSmsProvider` (`backend/providers/sms.provider.ts`), `EmailProvider` / `DisabledDevEmailProvider` (`backend/providers/email.provider.ts`), and `RateLimitStore` / `InMemoryRateLimitStore` (`backend/providers/rateLimit.store.ts`).
  - Development adapters return `disabled_dev`, never log OTPs or verification tokens, and never claim live delivery occurred.
- **Self-Registration & Registration Status Endpoints:**
  - `POST /api/v1/auth/register/student` (requires guardian details + minor consent, checks duplicates, stores HMAC-hashed OTP/email tokens, sets `pending_contact_verification` with `requiresGuardianVerification: true`).
  - `POST /api/v1/auth/register/parent` (links pending `guardian_relationships` awaiting school office verification).
  - `POST /api/v1/auth/register/staff` (sets `pending_contact_verification`; never permits client-assigned roles).
  - `POST /api/v1/auth/registration-status` (requires `referenceCode` + matching `identifier` with constant-time hash comparison and generic anti-enumeration responses).
  - Strict Zod DTO validation (`backend/modules/registration/registration.schemas.ts`) rejects Aadhaar fields and client-assigned `role` / `accountStatus` / `permissions`.
- **Bilingual Self-Registration UI (`src/components/portals/`):**
  - Added `SelfRegistrationPage.tsx` (`/student-register`, `/parent-register`, `/staff-register`), `RegistrationStatusPage.tsx` (`/registration-status`), `src/api/portalApi.ts`, links on `StudentLoginPage.tsx` / `StaffLoginPage.tsx`, and complete `kn` / `en` keys in `src/data/translations.ts`.

---

## 2. Remaining Work (Milestones 3–6)

- **Milestone 3 (Pending Approval):** Mobile OTP & email verification endpoints (`/verify/mobile`, `/verify/email`), passwordless login OTP request/verify (`/login/request-otp`, `/login/verify-otp`) with `HttpOnly` cookie issuance + CSRF tokens, and Account Recovery (`/recovery/request`, `/recovery/verify`).
- **Milestone 4 (Pending Approval):** Headmaster & School Admin approval/rejection/suspension APIs, role assignment transactions, guardian relationship verification, MFA step-up enforcement, and live Student/Parent/Staff/Admin data endpoints.
- **Milestone 5 (Pending Approval):** Replace Development Preview login pages & preview buttons with live backend OTP authentication and connect Student, Parent, Teacher, Headmaster, and Admin dashboards.
- **Milestone 6 (Pending Approval):** End-to-end integration tests, security review, and complete documentation suite (`BACKEND_ARCHITECTURE.md`, `DATABASE_SCHEMA.md`, `AUTHENTICATION_FLOW.md`, `RBAC_PERMISSION_MATRIX.md`, `API_DOCUMENTATION.md`, `SECURITY_CHECKLIST.md`, `DEPLOYMENT_GUIDE.md`, `ACCOUNT_APPROVAL_GUIDE.md`, `PRIVACY_AND_DATA_HANDLING.md`).

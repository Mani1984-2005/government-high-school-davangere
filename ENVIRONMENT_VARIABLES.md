# Environment Variables & External Service Requirements

**Project:** Government High School, Davangere — Bilingual School Portal  
**Baseline:** Option 1 — Integrated Express + TypeScript + Cloud SQL PostgreSQL + Drizzle ORM

All sensitive configuration keys must remain strictly server-side (`process.env`). **Never** prefix secrets with `VITE_`, and **never** commit real keys, passwords, or `.env` files to version control.

---

## 1. Server & Security Variables

| Variable | Required in Prod | Purpose | Development Default / Notes |
|---|---|---|---|
| `PORT` | Optional (`3000`) | Express + Vite server port | `3000` |
| `NODE_ENV` | Yes | `'development' \| 'test' \| 'production'` | `'development'` |
| `CORS_ALLOWED_ORIGINS` | Yes | Comma-separated origin allowlist for `/api/*` | `'http://localhost:3000'` |
| `SESSION_SECRET` | **Mandatory** | HMAC key for session token hashing | Ephemeral in-memory 32-byte key in dev only |
| `OTP_HMAC_SECRET` | **Mandatory** | Keyed HMAC secret for OTP & verification token hashes | Ephemeral in-memory 32-byte key in dev only |
| `DATA_HASH_PEPPER` | **Mandatory** | HMAC pepper for lookup hashes (`identifierHash`, `ipHash`) | Ephemeral in-memory 32-byte key in dev only |

---

## 2. Cloud SQL PostgreSQL Variables (Object Method Only)

Provisioned via Cloud SQL in AI Studio (`instanceName: ai-studio-4b2da1ae`, region: `asia-southeast1`). Do **not** use `DATABASE_URL` connection strings.

| Variable | Role | Used By |
|---|---|---|
| `SQL_HOST` | Cloud SQL Auth Proxy Unix socket / host | `src/db/index.ts`, `src/db/drizzle.config.ts` |
| `SQL_DB_NAME` | Target PostgreSQL database name | `src/db/index.ts`, `src/db/drizzle.config.ts` |
| `SQL_USER` | Least-privilege app runtime user (read/write data only) | `src/db/index.ts` |
| `SQL_PASSWORD` | Runtime database password | `src/db/index.ts` |
| `SQL_ADMIN_USER` | Schema migration admin user | `src/db/drizzle.config.ts` |
| `SQL_ADMIN_PASSWORD` | Schema migration admin password | `src/db/drizzle.config.ts` |

---

## 3. External Services Requiring Credentials Before Milestone 3 / Production

| Service | Variables Needed | Current Workspace Status |
|---|---|---|
| **DLT-Registered Indian SMS Gateway** (NIC SMS / MSG91 / AWS SNS) | `SMS_PROVIDER`, `SMS_API_KEY`, `SMS_SENDER_ID`, `SMS_DLT_ENTITY_ID`, `SMS_DLT_TEMPLATE_OTP_ID` | **Not configured** (`SMS_PROVIDER=disabled_dev`; `DisabledDevSmsProvider` never sends SMS or claims delivery) |
| **Transactional Email Service** (NIC SMTP / Resend / SES) | `EMAIL_PROVIDER`, `EMAIL_FROM_ADDRESS`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` / `EMAIL_API_KEY` | **Not configured** (`EMAIL_PROVIDER=disabled_dev`; `DisabledDevEmailProvider` never sends email) |
| **Redis Store** (multi-instance rate limiting & cooldowns) | `REDIS_URL` | **Optional / Not configured** (currently uses `InMemoryRateLimitStore` adapter) |
| **Firebase Auth / OAuth** (Cloud SQL platform integration) | `firebase-applet-config.json` (`projectId: bionic-boulder-3k4jk`) | Provisioned for Google OAuth / Firebase Admin SDK |
| **Official School Enrollment & Staff Directory Rosters / CeG SATS** | Authorized CSV/API import signed off by Headmaster / BEO | **Pending school approval** (zero real/fictional student PII in repo) |

# Upgrade Roadmap: Government High School, Davangere

**Date:** 2026-11-22  
**Goal:** Upgrade the existing portal into a modern, accessible, bilingual, secure, and maintainable official Karnataka government school website in controlled, verified stages.

---

## 1. Capability Assessment: Current Stack vs. Missing Backend Services

### 1.1 What Can Be Implemented With the Current Stack (Frontend + Optional Express Server)
`express`, `dotenv`, and `tsx` are already installed in `package.json`, alongside React 19, Vite 8, Tailwind CSS v4, TypeScript, and `lucide-react`.

- **With Vite + React (Client-Side):**
  - Complete Design System & Token Architecture (colors, typography, spacing, reusable `Button`, `Card`, `Badge`, `Modal`, `SectionHeader`, `FormField`, `Tabs`, `Alert` primitives).
  - Multi-section / multi-view navigation with URL hash/path routing (`/` Home, `/about`, `/academics`, `/faculty`, `/services`, `/notices`, `/gallery`, `/sdmc`, `/contact`, `/admin`, `/progress`), preserving `#section` compatibility and selected language (`kn`/`en`).
  - Full WCAG 2.1 AA/AAA Accessibility: proper `<html lang>`, focus-trapped accessible `Modal`, keyboard-navigable gallery & lightbox, ARIA tabs, linked `<label htmlFor>`, non-filter high-contrast mode, font-scale persistence.
  - Complete bilingual (`kn`/`en`) dictionary with zero hardcoded single-language leaks.
  - Real asset bundling & optimization (converting/importing images properly, adding `loading="lazy"`, responsive `aspect-*`, and generating downloadable official notice/study-capsule documents cleanly or via structured print sheets).
  - Adding the missing **About the School** section (history since 1968, vision & mission, infrastructure & facilities, verified institutional profile) and **Academic Calendar / Examination Info**.
  - Honoring data truthfulness: labeling `Pending School Approval` items transparently, preserving verified school facts, and never inventing stats or staff.

- **With Express Full-Stack Server (`server.ts` using existing `express` + `tsx` + `dotenv`):**
  - Genuine backend API endpoints (`/api/notices`, `/api/faculty`, `/api/gallery`, `/api/grievances`, `/api/service-requests`, `/api/admin/*`) instead of deceptive `localStorage`-only fake form submissions.
  - Server-side input validation, honeypot/rate-limit spam protection on contact/grievance & service forms, and honest server persistence (in-memory store with optional JSON file persistence or Cloud SQL/Firestore if provisioned).
  - Real Admin Authentication using `HttpOnly` signed session cookies, `scrypt` password hashing (built-in Node `crypto`), environment-configured admin credentials (no hardcoded passwords in source code), and server-side RBAC authorization for Notice, Gallery, Faculty, and Content management.
  - Server-side protection for the Student Progress prototype: moving demo student lookups behind a server API route (`POST /api/progress/verify`) with real server-side rate-limiting and anonymized sample records so student data is never shipped in the public JS bundle.

### 1.2 What External / Managed Services Are Missing (and Require Explicit Provisioning)
1. **Production Persistent Database (Cloud SQL / PostgreSQL or Firestore):** Container filesystem in AI Studio is ephemeral across container restarts/sleeps. An Express JSON/in-memory store works immediately for development/evaluation, while long-term production persistence requires provisioning a hosted database (e.g., Cloud SQL or Firebase) if requested.
2. **Government SATS API & NIC SMS OTP Gateway:** Live student records and 2FA parent OTP cannot be connected without official Centre for e-Governance (CeG) Karnataka credentials. The Student Progress Portal must therefore remain explicitly marked as **Anonymized Sample Prototype** backed by server-side verification rather than client-side arrays.
3. **Authorized School Media & PDF Documents:** Real teacher portraits and official signed PDF circulars must be supplied by the school administration (`BEO`/`Headmaster`); until provided, faculty uses clean accessible monogram avatars and notices offer structured print/HTML-to-download documents clearly labeled as specimen circulars.

---

## 2. Files Requiring Modification or Creation

### Existing Files to Modify
- `/package.json` — Clean up unused `@google/genai`, `autoprefixer`, fix `"clean"` script, add `"start": "node server.ts"` / `"dev": "tsx server.ts"` if Express backend is added.
- `/index.html` — Dynamic `lang` support, cleaned `<title>`/`<meta>`, font loading optimization (`Noto Sans Kannada`, `Plus Jakarta Sans`, `JetBrains Mono`).
- `/src/index.css` — Tokenized design system (`@theme`), accessible high-contrast mode (without `filter` on `html`), fixed `@media print` isolation, focus-visible ring standards.
- `/src/types/index.ts` — Expanded interfaces (`SchoolMilestone`, `FacilityItem`, `AcademicEvent`, `GrievanceSubmission`, `AdminUser`, `ApiResponse`, `StudyMaterial`).
- `/src/data/schoolData.ts` — Fix broken image references via ES module imports; add missing About/Facilities/Academic Calendar structures preserving only verified project info; align `AdminVerificationModal` count (`10`).
- `/src/data/translations.ts` — Complete `kn` and `en` keys removing all inline component string leaks.
- `/src/data/studentRecords.ts` — Anonymize/move out of public client bundle into server-side demo store (or strictly anonymized sample module if server-verified).
- `/src/App.tsx` — Introduce clean view/route management, shared `LanguageContext`/`AccessibilityContext`, and consolidated modal/page composition.
- `/src/components/*` — Refactor all 16 components onto shared UI primitives (`src/components/ui/*`), fix all accessibility/keyboard/ARIA/print/localization defects, add `#about` (`AboutSection.tsx`), and replace fake `localStorage` submission screens with real API calls + loading/error/empty states.

### New Files / Modules to Create
- `/src/context/AppContext.tsx` — Persisted language (`kn`/`en`), font scale, and high-contrast preferences + `<html lang>` sync.
- `/src/components/ui/` — Reusable design system primitives: `Button.tsx`, `Card.tsx`, `Badge.tsx`, `Modal.tsx`, `SectionHeading.tsx`, `FormControls.tsx`, `Tabs.tsx`, `Alert.tsx`.
- `/src/components/AboutSection.tsx` — Dedicated About the School section (1968 heritage, vision/mission, campus infrastructure, facilities, institutional facts).
- `/src/components/AdminDashboard.tsx` — Authenticated Admin Management console (notices, gallery, faculty, announcements, verification checklist, grievance/service inbox) gated by server-side auth.
- `/server.ts` — Express server mounting Vite middleware in dev (`port 3000`) and providing authenticated Admin APIs, validated public form endpoints (Contact/Grievance, Online Services), Notice/Gallery/Faculty CRUD, and server-side SATS demo lookup.

---

## 3. Recommended Implementation Order (Controlled Stages)

### Stage 1: Foundation, Design System & Asset Fix (Phases 2, 7 & 8 baseline)
1. Fix Vite ES imports for all 4 campus images (and optimize/configure lazy loading & dimensions) so production builds have zero 404s.
2. Define semantic color, typography, spacing, and contrast CSS tokens in `src/index.css`; remove `filter` from `html[data-theme="contrast"]`; fix `@media print` isolation.
3. Build reusable accessible UI primitives under `src/components/ui/` (`Modal` with focus trap & Escape handling, `Button`, `Card`, `Badge`, `Tabs`, `SectionHeading`, `FormField`).
4. Create `AppContext` for `lang`, `contrast`, `fontScale` persistence + `<html lang>` synchronization.

### Stage 2: Bilingual Completeness & Missing Content Sections (Phases 3 & 4)
1. Complete `translations.ts` so every UI string (including Tab 4 Report Card, attendance units, modals, forms) is 100% bilingual.
2. Build `AboutSection.tsx` (`#about`) preserving verified school facts (Estd 1968, UDISE, medium, KSEAB affiliation, infrastructure/facilities already documented in `schoolData.ts`).
3. Upgrade `AcademicsSection.tsx` with structured classes/subjects overview, examination info, and academic calendar highlights alongside the bell schedule and SSLC study desk.
4. Upgrade `Navbar.tsx` with clean responsive navigation (working `#about`, active section indicator, keyboard-accessible mobile drawer) and route/section support.

### Stage 3: Backend Architecture, Genuine Forms & Secure Administration (Phases 5 & 6)
1. Implement `server.ts` (Express + `vite.middlewares` in dev on port 3000) with structured REST endpoints, server-side input validation, rate limiting, and honeypot spam protection.
2. Wire `ContactSection` (accessible form + spam protection) and `OnlineServicesModal` to real `POST /api/grievances` and `POST /api/services` endpoints with genuine loading, validation, and error states (no fake success on offline/error).
3. Move demo `studentRecords` off the client bundle into server-side `POST /api/progress/verify` with real server-side rate-limiting and anonymized sample records.
4. Build secure Admin login + `AdminDashboard` (Notices, Gallery, Faculty, Announcements, Verification Status) using `HttpOnly` signed session cookies, `crypto.scrypt` password verification via `ADMIN_PASSWORD_HASH` / env-configured credentials (no hardcoded passwords), and strict server-side RBAC.

### Stage 4: Performance, Accessibility & Verification (Phases 8 & 9)
1. Audit bundle size (remove unused `@google/genai`, `autoprefixer`, verify chunking and image loading).
2. Run `tsc --noEmit`, `npm run build`, and live browser testing across desktop/mobile viewports, Kannada & English modes, high-contrast mode, keyboard navigation, all forms, admin flows, and console logs.
3. Produce `TEST_REPORT.md` and `IMPLEMENTATION_SUMMARY.md`.

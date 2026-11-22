# Upgrade Roadmap: Government High School, Davangere

**Updated:** 2026-11-22  
**Goal:** Transform the prototype school portal into a modern, accessible, bilingual, secure, and maintainable official Karnataka government school website in controlled stages.

---

## 1. Completed Stages (Frontend Static Architecture — Option B)

### Phase 1: Project Audit (Completed)
- Audited all source files, assets, configuration, accessibility defects, localization leaks, student PII exposure, and fake `localStorage` submissions.
- Produced `PROJECT_AUDIT.md`, `CURRENT_ARCHITECTURE.md`, and `UPGRADE_ROADMAP.md`.

### Phase 2: Foundation, Design System & Core Architecture (Completed)
- Cleaned `package.json` unused template dependencies (`@google/genai`, `express`, `dotenv`, `autoprefixer`, `motion`, `@types/express`, `tsx`) while keeping the lean React 19 + Vite 8 + TypeScript 7 + Tailwind CSS v4 + `lucide-react` stack.
- Created `src/assets/media.ts` using static ES module imports so Vite reliably bundles all 4 campus JPEG assets into `dist/assets/`.
- Established semantic design tokens, accessible `data-theme="contrast"` (removing broken `html { filter }`), `@media print` isolation, and `prefers-reduced-motion` support in `src/index.css`.
- Built reusable accessible primitives under `src/components/ui/`: `Alert`, `Badge`, `Button`, `Card`, `FormControls`, `Modal`, `SafeImage`, `SectionHeading`, and `Tabs`.
- Implemented `AppProvider` (`src/context/AppContext.tsx`) persisting language (`kn`/`en`), high-contrast toggle, and font scaling, and synchronizing `<html lang="...">`.
- Centralized bilingual UI strings in `src/data/translations.ts`.

### Stage 3A–3D: Website Sections, Privacy Cleanup & Accessibility (Completed)
- **Stage 3A:** Created `AboutSection` (`#about`) and `FAQSection` (`#faq`, toggleable accordion respecting `prefers-reduced-motion`), connected to `Navbar` and `App.tsx`.
- **Stage 3B:** Upgraded `AcademicsSection`, `FacultySection`, `NoticesSection`, `MidDayMealSection`, and `WelfareSchemesSection` onto shared UI primitives and `AppProvider`.
- **Stage 3C:**
  - Upgraded `GallerySection` with `<button>` photo cards, ARIA tabs, and keyboard-accessible lightbox (`Previous`/`Next` + `ArrowLeft`/`ArrowRight`).
  - Upgraded `SdmcSection`, `ContactSection` (replaced fake `localStorage` ticket submission with validated `mailto:` / Copy Draft / Print Enquiry Slip composer + honeypot field), and `Footer`.
- **Stage 3D:**
  - Deleted `/src/data/studentRecords.ts` completely, removing all fictional student records and credentials from the client bundle.
  - Replaced `StudentProgressTracker` with an **Upcoming SATS Integration & Digital Portals** information card (`#progress`) + 7-item Security Prerequisites modal.
  - Rewrote `OnlineServicesModal` into an honest **Office Visit Guide & Printable/.txt Enquiry Slip** generator (zero fake submissions or `localStorage` PII).
  - Updated `AdminVerificationModal` to use `ui/Modal` and dynamically reference `SCHOOL_VERIFICATION_CHECKLIST.length` (`10`).

### Phase 3B: Professional Landing Page, Student & Staff Portals, RBAC Navigation (Completed — Frontend Preview)
- **Landing Page Redesign:** Upgraded `Navbar` (with `Student Portal` & `Staff Portal` CTAs and session status) and `HeroSection` (full-width `#102b54` hero with bundled campus photo, `Explore School`, `Student Portal`, `Staff Portal`, quick stats, and daily meal card), and added `QuickAccessSection` (8-card institutional directory).
- **Portal Navigation & SPA Routing:** Built `PortalProvider` (`src/context/AuthContext.tsx`) managing client-side History API routes (`/`, `/student-portal`, `/student-dashboard`, `/staff-portal`, `/staff-dashboard`), history-aware `goBack()` / `goHome()`, section anchor navigation, and `PortalNavBar` (`Back`, `Home`, Breadcrumb, `Logout`) preserving language state across transitions.
- **Student & Staff Portals (Development Preview):** Built `StudentLoginPage`, `StudentDashboard`, `StaffLoginPage`, `StaffDashboard` (with explicitly disabled `Attendance Module Placeholder`), and `UnauthorizedView` role guard.

---

## 2. Remaining Future Backend Requirements (Not Implemented Under Static Option B)

Implementing live production portals requires provisioning a dedicated backend server (e.g., Node.js/Express `server.ts` or government-hosted API) and database:

1. **Server-Side Authentication & Session Management:**
   - Endpoints: `POST /api/auth/student/login`, `POST /api/auth/staff/login`, `POST /api/auth/logout`, `GET /api/auth/me`.
   - Password hashing using `crypto.scrypt` or `bcrypt` with per-user salts (zero plaintext or client-side credentials).
   - `HttpOnly`, `Secure`, `SameSite=Lax` (or `Strict`) signed/opaque session cookies with expiration and CSRF token protection.
   - Server-side rate limiting and account lockout (IP + identifier) replacing client-only validation.
2. **Role-Based Access Control (RBAC) Middleware:**
   - Enforce `requireAuth` and `requireRole('student' | 'staff' | 'admin')` on every protected API endpoint before querying or mutating records.
3. **Persistent Relational / Document Database:**
   - Store verified school notices, academic calendar events, faculty roster updates, attendance registers, grievance/service submissions, and audit logs (with migration scripts and backups).
4. **Official Government Integrations:**
   - **Centre for e-Governance (CeG) Karnataka SATS API:** Authorised school integration for live student marks, attendance, and TC status.
   - **NIC SMS / OTP Gateway:** Parent/staff verification and official password reset workflows.
5. **Production Media & Circular Storage:**
   - Authenticated staff upload pipeline for signed PDF circulars and verified campus/faculty photography with MIME validation and size caps.
6. **Institutional Content Sign-Off:**
   - School Headmaster / BEO / DDPI verification of the 10 items in `SCHOOL_VERIFICATION_CHECKLIST` (`AdminVerificationModal`) prior to live public launch.

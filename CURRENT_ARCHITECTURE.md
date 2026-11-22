# Current Architecture: Government High School, Davangere

**Updated:** 2026-11-22 (Post Phase 2, Stage 3A–3D & Phase 3B)  
**Runtime Stack:** React 19.0.1 · TypeScript 7.0.2 · Vite 8.3.0 · Tailwind CSS 4.3.3 (`@tailwindcss/vite`) · `lucide-react` 0.546.0

---

## 1. High-Level System Architecture

The application is a **static client-side Single-Page Application (SPA)** (Static Frontend Only / Option B) with clean SPA history routing, in-memory development-preview portal state, bundled image assets, and complete Kannada/English localization. It does **not** ship a backend server, database, or real authentication service yet.

```text
+-----------------------------------------------------------------------+
| Browser (Client-Side Static SPA)                                      |
|                                                                       |
|  index.html -> src/main.tsx -> src/App.tsx                            |
|                                  |                                    |
|     +----------------------------+-----------------------------+      |
|     | AppProvider (src/context/AppContext.tsx)                 |      |
|     | - lang ('kn' | 'en') synced to <html lang="...">         |      |
|     | - contrast (boolean -> <html data-theme="contrast">)     |      |
|     | - fontScale (0.85..1.25 -> CSS var --font-scale)         |      |
|     | - Persisted safely in localStorage (UI prefs only)       |      |
|     +----------------------------+-----------------------------+      |
|                                  |                                    |
|     +----------------------------v-----------------------------+      |
|     | PortalProvider (src/context/AuthContext.tsx)             |      |
|     | - route ('/' | '/student-portal' | '/student-dashboard'  |      |
|     |          | '/staff-portal' | '/staff-dashboard')         |      |
|     | - History API routing (pushState + popstate + history    |      |
|     |   stack fallback for Home / Back / section anchor jumps) |      |
|     | - session (AuthSession | null) in React memory ONLY      |      |
|     | - hasRole(), loginDemoStudent(), loginDemoStaff(),       |      |
|     |   logout() — zero passwords or PII in localStorage       |      |
|     +----------------------------+-----------------------------+      |
|                                  |                                    |
|     +----------------------------v-----------------------------+      |
|     | Static Content & Media Layer                             |      |
|     | - src/assets/media.ts (Vite ES imports of 4 campus JPGs) |      |
|     | - src/data/schoolData.ts (verified & checklist-tracked)  |      |
|     | - src/data/translations.ts (complete kn & en dictionary) |      |
|     +----------------------------------------------------------+      |
+-----------------------------------------------------------------------+
```

---

## 2. Routing, Portals & Component Hierarchy

`App.tsx` wraps `<PortalShell />` inside `<AppProvider>` and `<PortalProvider>`, rendering persistent chrome (`GovHeader`, `Navbar`, `Footer`, `OnlineServicesModal`, `AdminVerificationModal`) and switching `<main id="main-content">` between the redesigned homepage and protected Student/Staff portal views.

### 2.1 Public Landing Page (`/`)
1. `GovHeader` — Accessibility skip link (`#main-content`), font scale (`A-`/`A`/`A+`), contrast toggle, bilingual switcher (`ಕನ್ನಡ`/`ENG`), Karnataka emblem & school masthead, UDISE badge, Admin Verification checklist trigger.
2. `Navbar` — Sticky single-line primary navigation (`About`, `Academics`, `Notices`, `Faculty`, `Gallery`, `Contact`), `Student Portal` & `Staff Portal` entry CTAs (adapting to `Dashboard` + `Logout` when an active preview session exists), Services Guide CTA, and accessible mobile drawer.
3. `LiveTicker` — Urgent announcement strip linking to `#notices` (hidden cleanly on portal routes and `@media print`).
4. `HeroSection` (`#home`) — Official `#102b54` navy portal banner with bundled `SCHOOL_MEDIA.campus` (`loading="eager"`), primary actions (`Explore School`, `Student Portal`, `Staff Portal`, `Services Guide`), `SCHOOL_INFO` summary strip, and dynamic day-of-week Akshara Dasoha meal preview.
5. `QuickAccessSection` (`#quick-access`) — Accessible 8-card directory (`Academics`, `Student Services`, `Faculty`, `Notice Board`, `Gallery`, `About the School`, `Welfare Schemes`, `Contact`).
6. `AboutSection` (`#about`) — School history since 1968, vision & mission, institutional profile, and facilities overview.
7. `NoticesSection` (`#notices`) — ARIA tab category filters, search, Headmaster Desk card, and accessible Circular Print Modal.
8. `FAQSection` (`#faq`) — Accessible toggleable accordion covering admissions and school policies (`prefers-reduced-motion` compliant).
9. `AcademicsSection` (`#academics`) — Daily bell schedule, science lab spotlight (`SCHOOL_MEDIA.scienceLab`), SSLC study materials modal, co-curricular clubs.
10. `MidDayMealSection` (`#meals`) — Akshara Dasoha program overview (`SCHOOL_MEDIA.midDayMeal`), 6-day menu table with `<th scope="col">`, dynamic day highlighting, Sunday notice.
11. `WelfareSchemesSection` (`#schemes`) — Government scholarship & welfare scheme cards (`SSP`, `NMMS`, `Vidya Vikas`, `RBSK`, etc.).
12. `StudentProgressTracker` (`#progress`) — **Upcoming SATS Integration & Digital Portals** information card (zero student PII; replaced legacy hardcoded student records) with Student/Staff portal links and a 7-item Security Prerequisites modal.
13. `SdmcSection` (`#sdmc`) — Statutory mandate, SDMC member table (`<th scope="col">`), and documented resolutions.
14. `FacultySection` (`#faculty`) — Department-filterable faculty directory.
15. `GallerySection` (`#gallery`) — Accessible `<button>` photo cards, ARIA category tabs, and keyboard-navigable Lightbox (`Previous`/`Next` buttons + `ArrowLeft`/`ArrowRight` + focus-trapped `Modal`).
16. `ContactSection` (`#contact`) — Address, transit details, official helplines, and validated **Email (`mailto:`) / Copy Draft / Print Enquiry Slip** composer with honeypot spam field (no fake ticket submission).
17. `Footer` — 4-column institutional footer with internal section links, Student & Staff portal shortcuts, Government of Karnataka external portals, and verification modal button.

### 2.2 Portal Routes & Reusable Navigation
- `PortalNavBar` (`src/components/PortalNavBar.tsx`) — Top bar rendered across portal views providing `Back` (`goBack()`), `Home` (`goHome()`), semantic Breadcrumb `<nav aria-label>`, and active-session `Logout`.
- `/student-portal` -> `StudentLoginPage` — Validated Student/SATS ID + Password form (`Eye`/`EyeOff` toggle), Forgot Password office-reset modal, Backend Security Notice alert, Development Preview Dashboard button, and Staff Portal link.
- `/student-dashboard` -> Protected by `hasRole('student')`; renders `StudentDashboard` (sidebar tabs: `Overview`, `Academics & Exams`, `Attendance Policy`, `Study Materials` download, `Notices`, `Welfare Schemes`) or `UnauthorizedView` (`requiredRole="student"`).
- `/staff-portal` -> `StaffLoginPage` — Validated Staff ID/Official Email + Password form (`Eye`/`EyeOff` toggle), Forgot Password office-reset modal, Backend Security Notice alert, Development Preview Workspace button, and Student Portal link.
- `/staff-dashboard` -> Protected by `hasRole('staff')`; renders `StaffDashboard` (sidebar tabs: `Staff Profile`, `Bell Timetable`, `Resources & Facilities`, `Notices`, and explicitly disabled `Attendance Module Placeholder` pending backend API) or `UnauthorizedView` (`requiredRole="staff"`).

### 2.3 Reusable UI Primitives (`src/components/ui/`)
- `Alert.tsx`, `Badge.tsx`, `Button.tsx`, `Card.tsx`, `FormControls.tsx`, `Modal.tsx` (focus-trapped, Escape-handled, scroll-locked), `SafeImage.tsx`, `SectionHeading.tsx`, `Tabs.tsx`, exported via `src/components/ui/index.ts`.

---

## 3. Styling, Accessibility & Asset Pipeline

- **CSS Framework & Tokens (`src/index.css`):** Tailwind CSS v4 with semantic tokens, accessible high-contrast overrides (`[data-theme="contrast"]` without CSS `filter` on `<html>`), fixed `@media print` isolation, consistent `:focus-visible` outlines, and `@media (prefers-reduced-motion: reduce)` handling.
- **Fonts:** `Noto Sans Kannada`, `Plus Jakarta Sans`, and `JetBrains Mono` loaded via Google Fonts in `index.html`.
- **Asset Pipeline (`src/assets/media.ts`):** All 4 campus JPEG images are imported as ES modules (`SCHOOL_MEDIA`), guaranteeing Vite hashes and emits them into `dist/assets/` with zero `404` errors.

---

## 4. Security & Privacy Posture

- **Zero Student PII in Client Bundle:** `src/data/studentRecords.ts` has been deleted permanently.
- **No Hardcoded Credentials:** Zero passwords, tokens, API keys, or secrets exist anywhere in `src/` or `dist/`.
- **No Deceptive Local Submissions:** `ContactSection` and `OnlineServicesModal` explicitly guide users to official school office visits or `mailto:` / printable enquiry slips instead of writing PII to `localStorage` under fake ticket numbers.
- **Development-Preview Authentication Only:** `AuthContext.tsx` keeps temporary preview sessions strictly in React state so nothing sensitive persists across browser sessions. Production authentication requires implementing the documented backend endpoints (`HttpOnly` cookies + `scrypt`/`bcrypt` + RBAC).

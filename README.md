# Government High School, Davangere — Official Bilingual Portal

Bilingual (**Kannada / English**) web portal for **Government High School, Davangere, Karnataka** (`UDISE: 29270104501` · `School Code: DVG-GHS-042` · `Estd: 1968`), built with React 19, TypeScript, Vite 8, and Tailwind CSS v4.

## Key Features

- **Bilingual Experience (`ಕನ್ನಡ` / `ENG`):** Instant language switching synced to `<html lang>` across all landing sections, modals, and portal views.
- **Accessibility Controls:** Keyboard skip link, persistent font size scaling (`A-` / `A` / `A+`), CSS high-contrast theme, focus-trapped modals, ARIA tabs/accordions, and `prefers-reduced-motion` support.
- **Redesigned Institutional Landing Page:** Official Karnataka portal header, quick-access 8-card directory, about section, notices & circulars (with print sheet), admissions FAQ accordion, academics & SSLC study resources, Akshara Dasoha Mid-Day Meal schedule, welfare schemes, SDMC governance, faculty directory, keyboard-navigable gallery lightbox, and office contact tools.
- **Student & Staff Portals (Development Preview UI):** Dedicated login portals (`/student-portal`, `/staff-portal`), role-protected preview dashboards (`/student-dashboard`, `/staff-dashboard`), unauthorized route guard, and consistent **Home**, **Back**, and **Breadcrumb** navigation (`PortalNavBar`).
- **Privacy & Honesty First:** Static Frontend Only (`Option B`) architecture containing zero bundled student PII, zero hardcoded passwords, and clear documentation of backend prerequisites before live production login or attendance saving.

## Routes

| Path | View | Access |
|---|---|---|
| `/` | School Homepage & Information Sections | Public |
| `/student-portal` | Student Login Portal (Development Preview) | Public |
| `/student-dashboard` | Student Dashboard | Preview Session (`student` role) |
| `/staff-portal` | Staff Login Portal (Development Preview) | Public |
| `/staff-dashboard` | Staff Workspace & Disabled Attendance Placeholder | Preview Session (`staff` role) |

## Local Development

**Prerequisites:** Node.js (v18+ recommended) and npm.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run TypeScript checks:
   ```bash
   npm run lint
   ```
3. Start the development server (port `3000`):
   ```bash
   npm run dev
   ```
4. Build and preview the production bundle:
   ```bash
   npm run build
   npm run preview
   ```

## Project Documentation

- `PROJECT_AUDIT.md` — Audit findings and resolution status.
- `CURRENT_ARCHITECTURE.md` — Component hierarchy, routing, contexts, and styling pipeline.
- `UPGRADE_ROADMAP.md` — Completed stages and documented future backend requirements.
- `PHASE_3B_IMPLEMENTATION.md` — Detailed Phase 3B & Stage 3C/3D implementation and verification summary.

# Current Architecture: Government High School, Davangere

**Audit Date:** 2026-11-22  
**Runtime Stack:** React 19.0.1 · TypeScript 7.0.2 · Vite 8.3.0 · Tailwind CSS 4.3.3 (`@tailwindcss/vite`)

---

## 1. High-Level System Architecture

The application is currently a **pure client-side Single-Page Application (SPA)** with zero server-side API endpoints, zero database connections, and zero external API integrations at runtime.

```text
+-------------------------------------------------------------------+
| Browser (Client-Side Only)                                        |
|                                                                   |
|  index.html -> src/main.tsx -> src/App.tsx                        |
|                                  |                                |
|     +----------------------------+-----------------------------+  |
|     | Global UI State in App.tsx                               |  |
|     | - lang ('kn' | 'en')                                     |  |
|     | - contrast (boolean -> <html data-theme="contrast">)     |  |
|     | - fontScale (0.85..1.25 -> CSS var --font-scale)         |  |
|     | - isServiceModalOpen / isAdminModalOpen                  |  |
|     +----------------------------+-----------------------------+  |
|                                  |                                |
|     +----------------------------v-----------------------------+  |
|     | Static Data Layer (Bundled in Client JS)                 |  |
|     | - src/data/schoolData.ts                                 |  |
|     | - src/data/translations.ts                               |  |
|     | - src/data/studentRecords.ts (2 demo SATS profiles)      |  |
|     +----------------------------+-----------------------------+  |
|                                  |                                |
|     +----------------------------v-----------------------------+  |
|     | Browser Persistence (localStorage only)                  |  |
|     | - ghs_davangere_service_apps (OnlineServicesModal)       |  |
|     | - ghs_grievances (ContactSection)                        |  |
|     +----------------------------------------------------------+  |
+-------------------------------------------------------------------+
```

---

## 2. Component Hierarchy & Data Flow

`App.tsx` renders a single vertical document of 10 bands plus 2 global modals:

1. `GovHeader` — Accessibility skip link, font size controls (`A-`/`A`/`A+`), contrast toggle, bilingual switcher (`ಕನ್ನಡ`/`ENG`), school emblem SVG, UDISE badge, Admin Verification button.
2. `Navbar` — Sticky navigation with anchor links (`#home`, `#about` [broken], `#notices`, `#meals`, `#schemes`, `#academics`, `#progress`, `#sdmc`, `#faculty`, `#gallery`, `#contact`), mobile drawer, and Service Modal CTA.
3. `LiveTicker` — Scroll-trigger announcement bar jumping to `#notices`.
4. `<main id="main-content">`
   - `HeroSection` (`#home`) — School intro, quick stats, dynamic day-of-week Akshara Dasoha meal preview.
   - `NoticesSection` (`#notices`) — Category filter tabs + search + Headmaster Desk sidebar + Notice Print Modal.
   - `MidDayMealSection` (`#meals`) — Akshara Dasoha overview, dynamic day highlighting, 6-day menu table, hygiene standards.
   - `WelfareSchemesSection` (`#schemes`) — 6 government scheme cards.
   - `AcademicsSection` (`#academics`) — Bell schedule, Science Lab spotlight, SSLC study material preview modal, co-curricular clubs.
   - `StudentProgressTracker` (`#progress`) — Prototype SATS login gate, client-side rate limiter/session timer, 4-tab student dashboard, printable report card, security checklist modal.
   - `SdmcSection` (`#sdmc`) — Statutory mandate, 6-member SDMC table, recent resolutions.
   - `FacultySection` (`#faculty`) — 9-card faculty grid.
   - `GallerySection` (`#gallery`) — Category-filtered 4-photo grid + lightbox modal.
   - `ContactSection` (`#contact`) — Address, transit guide, helplines, grievance form writing to `localStorage`.
5. `Footer` — 4-column summary, external Karnataka Govt portal links, statutory compliance list, Admin Verification modal trigger.
6. `OnlineServicesModal` — Admission/TC/Study Certificate/SSP request form writing to `localStorage` + printable receipt.
7. `AdminVerificationModal` — 10-item pre-deployment school verification checklist with ephemeral checkbox state.

### Inter-Component Communication
- **Routing:** None. Uses native HTML hash anchors (`#section-id`) with `scroll-behavior: smooth`. Deep-linking to specific tabs, notices, or administrative views is unsupported.
- **State management:** Strictly local `useState` in `App.tsx` and leaf components. No Context API or shared store; `lang` prop is drilled down to all 16 components.
- **Persistence:**
  - `lang`, `contrast`, and `fontScale` are **not persisted** (reset on reload).
  - `OnlineServicesModal` and `ContactSection` persist submissions to browser `localStorage` only.
  - `AdminVerificationModal` state is discarded on close/reload.

---

## 3. Styling & Asset Pipeline

- **CSS Framework:** Tailwind CSS v4 loaded via `@tailwindcss/vite` plugin (`@import "tailwindcss";` in `src/index.css`).
- **Fonts:** Loaded from Google Fonts CDN in `index.html`:
  - `Noto Sans Kannada` (primary Kannada sans)
  - `Plus Jakarta Sans` (English UI sans)
  - `Tiro Kannada` (declared in `<link>` but unused in CSS)
  - `JetBrains Mono` (monospace codes/IDs)
- **Color Palette (Implicit, Not Tokenized):**
  - Primary Navy: `#13325e`, Dark Navy: `#0b1f3c` / `#0c1f3c` / `#102b54`
  - Accent Gold/Amber: Tailwind `amber-400` (`#fbbf24`) / `#f8c01c`
  - Emerald Status: `emerald-700` / `emerald-800` / `emerald-100`
  - Neutral Surfaces: `slate-50`, `slate-100`, `white`
- **Design System Consistency Issues:**
  - `index.css` declares CSS custom properties (`--primary-gov`, `--gov-green`, `--karnataka-yellow`, `--karnataka-red`, `--saffron`), yet components hardcode hex values (`#13325e`, `#0b1f3c`, `#0c1f3c`, `#102b54`) and Tailwind utility colors directly instead of referencing semantic design tokens.
  - Modals are implemented inconsistently across 6 separate components with duplicated backdrop, Escape-key listeners, scroll-locking, and header/footer markup.
- **Asset Pipeline Bug:**
  - All 4 local JPEGs live in `src/assets/images/` and are referenced as string paths (`/src/assets/images/...`). Vite treats string paths as public root URLs rather than module dependencies, leaving `dist/assets/` with **zero images** after `vite build`.

---

## 4. Backend & Infrastructure Evaluation

| Capability | Declared in `package.json`? | Actually Implemented? | Gap |
|---|---|---|---|
| Express HTTP Server | Yes (`express ^4.21.2`, `tsx`) | No (`server.ts` / `server.js` absent) | No API routes, no server-side validation, no session cookies |
| Environment Config | Yes (`dotenv ^17.2.3`) | No | `.env.example` only has placeholder `GEMINI_API_KEY=` |
| Persistent Database | No | No (`localStorage` + static TS arrays) | No SQL/Firestore persistence for notices, applications, grievances, or admin |
| Authentication / RBAC | No | No (client-side demo lookup only) | No hashed credentials, no server sessions, no admin auth |
| File Uploads / PDFs | No | No (`window.print()` used instead) | No downloadable PDF circulars or gallery image upload pipeline |

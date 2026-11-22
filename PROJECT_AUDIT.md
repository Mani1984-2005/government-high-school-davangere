# Project Audit: Government High School, Davangere

**Repository:** `Mani1984-2005/government-high-school-davangere`  
**Audit Date:** 2026-11-22  
**Audit Scope:** Complete recursive inspection of configuration, entrypoints, components, data modules, stylesheets, types, and static assets (`26` source/asset files + configuration files).

---

## 1. Executive Summary

The existing project is a bilingual (Kannada + English) React 19 + TypeScript + Vite 8 + Tailwind CSS v4 single-page application (SPA) built as a prototype portal for **Government High School, Davangere, Karnataka** (`UDISE: 29270104501`, `School Code: DVG-GHS-042`, `Estd: 1968`).

The codebase demonstrates thoughtful domain coverage (Karnataka KSEAB SSLC, Akshara Dasoha Mid-Day Meal, Ksheera Bhagya, SSP/NMMS/RBSK welfare schemes, SDMC governance, SATS progress prototype, bilingual copy) and explicitly includes an internal `SCHOOL_VERIFICATION_CHECKLIST` acknowledging that institutional figures and student data are currently in **prototype / pending official school confirmation** status.

However, the audit uncovered **critical production defects, broken navigation, accessibility gaps, client-side data/form simulation issues, and unused backend/AI template dependencies** that must be systematically resolved before the portal can be considered production-grade.

---

## 2. Complete File Inventory

| File Path | Purpose | Status / Notes |
|---|---|---|
| `/index.html` | HTML shell, SEO meta tags, Google Fonts (`Noto Sans Kannada`, `Plus Jakarta Sans`, `Tiro Kannada`, `JetBrains Mono`) | Hardcodes `lang="en"` despite default app state `'kn'` |
| `/package.json` | Dependencies & npm scripts (`dev`, `build`, `preview`, `clean`, `lint`) | Contains 8 unused dependencies from template; `clean` references non-existent `server.js` |
| `/tsconfig.json` | TypeScript config (`ES2022`, `react-jsx`, `@/*` path alias) | `@/*` alias is configured but unused across `src/` |
| `/vite.config.ts` | Vite 8 + `@tailwindcss/vite` + `@vitejs/plugin-react` | Updated during environment migration (`host`, `port: 3000`, `allowedHosts`) |
| `/metadata.json` | Applet metadata (`name`, `description`, `majorCapabilities`) | Declares `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API` though no Gemini code exists |
| `/README.md` | Generic AI Studio template README | References `.env.local` and `GEMINI_API_KEY` not used by app |
| `/src/main.tsx` | React 19 `createRoot` entry | Clean |
| `/src/App.tsx` | Root composition, global state (`lang`, `contrast`, `fontScale`, modals) | Single-page vertical stack; missing `#about` section |
| `/src/index.css` | Tailwind v4 `@import "tailwindcss"`, CSS variables, high-contrast theme, `@media print` | `filter: contrast(120%)` on `html` breaks `position: fixed`; broken print selector scoping |
| `/src/types/index.ts` | 11 TypeScript interfaces/types (`Language`, `NoticeItem`, `StudentProgressRecord`, etc.) | Well-typed, missing interfaces for `SSLC_STUDY_MATERIALS` & grievance records |
| `/src/data/schoolData.ts` | Institutional metadata, notices, mid-day meal menu, welfare schemes, bell schedule, SDMC, faculty, gallery, study materials, verification checklist | Uses unbundled `/src/assets/images/...` string paths; checklist items marked `Pending School Approval` |
| `/src/data/studentRecords.ts` | 2 demo student progress records (`Sanjana H. M.`, `Praveen Kumar B.`) | Client-side array with `regMobile`, `dob`, grades, attendance bundled in JS |
| `/src/data/translations.ts` | Bilingual `kn`/`en` dictionary (`UI_STRINGS`) | Comprehensive, but some components still hardcode bilingual strings inline |
| `/src/components/GovHeader.tsx` | Skip link, accessibility ribbon (`A-`/`A`/`A+`, Contrast, `ಕನ್ನಡ`/`ENG`), school masthead | Clean structure; contrast/font state not persisted |
| `/src/components/Navbar.tsx` | Sticky nav bar + mobile drawer + Online Services CTA | Links to `#about` which does not exist in DOM |
| `/src/components/LiveTicker.tsx` | Latest notice banner | Missing `.ticker-band` class referenced in `@media print` |
| `/src/components/HeroSection.tsx` | Hero banner, quick facts, dynamic today's meal preview | Unbundled image string path; hardcoded metric text instead of `SCHOOL_INFO` |
| `/src/components/NoticesSection.tsx` | Filterable/searchable circulars + Headmaster Desk + print modal | Missing ARIA tab semantics, focus trap, and real downloadable PDFs |
| `/src/components/MidDayMealSection.tsx` | Akshara Dasoha overview, 6-day menu table, hygiene checklist | Unbundled image string path; Sunday fallback banner works |
| `/src/components/WelfareSchemesSection.tsx` | 6 welfare scheme cards + external SSP portal link | Clean |
| `/src/components/AcademicsSection.tsx` | Daily bell schedule, science lab spotlight, SSLC study capsules modal, clubs | Unbundled image string path; modal lacks Escape/focus trap & close `aria-label` |
| `/src/components/StudentProgressTracker.tsx` | 933-line SATS prototype login, 4-tab student dashboard, security checklist modal | Largest component; hardcoded Kannada text in English mode; hardcoded `180` days; client-side auth |
| `/src/components/SdmcSection.tsx` | SDMC mandate, 6-member roster table, 2025-26 resolutions | Clean |
| `/src/components/FacultySection.tsx` | 9 faculty profile cards | Initials avatar; no photos or department filtering |
| `/src/components/GallerySection.tsx` | 4-photo category-filtered grid + lightbox modal | Keyboard inaccessible (`<div onClick>`); unbundled image paths |
| `/src/components/ContactSection.tsx` | Address, transit guide, helplines, grievance form (`localStorage`) | Simulates backend ticket submission via `localStorage` without backend |
| `/src/components/Footer.tsx` | 4-column official footer + Govt portal links + checklist trigger | Clean |
| `/src/components/OnlineServicesModal.tsx` | Admission/TC/Study Cert/SSP form + receipt + `localStorage` history | Simulates submission via `localStorage`; lacks validation error feedback UI |
| `/src/components/AdminVerificationModal.tsx` | Pre-deployment 10-item checklist modal | Copy says "8 institutional facts" while array has 10; ephemeral state only |
| `/src/assets/images/*.jpg` (4 files) | Campus, Mid-Day Meal, Science Lab, Sports Meet photos (`3.9 MB` total) | **Broken in production build** (`dist/assets/` contains 0 images) & unoptimized (`875 KB - 1.1 MB` each) |

---

## 3. Critical Bugs & Functional Defects Found

### 3.1 Broken Production Images (Severity: CRITICAL)
- **Files affected:** `HeroSection.tsx:106`, `MidDayMealSection.tsx:51`, `AcademicsSection.tsx:104`, `src/data/schoolData.ts:327,337,345,354`.
- **Root cause:** Images are stored in `src/assets/images/` and referenced with string literals `"/src/assets/images/..."`. During `npm run build` (`vite build`), Vite only processes static ES imports (`import img from '...'`) or files in `/public`. Inspection of `dist/assets/` confirms **zero `.jpg` files** are emitted in the production bundle — every image yields `404 Not Found` in production.
- **Asset weight:** Total size of the 4 JPEGs is **3.9 MB** (`hero_school_campus`: 1.1 MB, `cultural_sports_meet`: 1.1 MB, `akshara_dasoha_meal`: 929 KB, `school_science_lab`: 875 KB) — far too heavy for low-bandwidth mobile users across Karnataka.

### 3.2 Broken Navigation Link (`#about`) (Severity: HIGH)
- `Navbar.tsx:16` renders `<a href="#about">About School / ಶಾಲೆಯ ಬಗ್ಗೆ</a>`, but **no element with `id="about"` exists anywhere in `App.tsx` or any section component**. Clicking the link does nothing.

### 3.3 Bilingual / Localization Defects (Severity: HIGH)
- **`index.html`:** `<html lang="en">` is static even though default `lang` in `App.tsx` is `'kn'`. Screen readers and browser font/hyphenation engines misidentify Kannada text as English.
- **`StudentProgressTracker.tsx`:**
  - Line 629: `<span>{lang === 'kn' ? 'ಹಾಜರು:' : 'Present:'} {m.presentDays} ದಿನಗಳು</span>` — appends Kannada word `ದಿನಗಳು` in English mode.
  - Lines 752, 756, 760, 764, 774, 785: Tab 4 (Official Report Card) hardcodes Kannada labels (`ವಿದ್ಯಾರ್ಥಿಯ ಹೆಸರು:`, `ತರಗತಿ & ವಿಭಾಗ:`, `ಹಾಜರಾತಿ ಶೇಕಡಾವಾರು:`, `ವಿಷಯ (Subject)`, `sub.subjectKn`) even when `lang === 'en'`.
  - Lines 640-641: Hardcodes `180` attendance days in static string instead of `authenticatedStudent.totalPresentDays`.
- **HeroSection.tsx / SdmcSection.tsx / GallerySection.tsx / OnlineServicesModal.tsx:** Large amounts of copy are written inline as `lang === 'kn' ? ... : ...` rather than centralized in `translations.ts`, making consistent bilingual auditing difficult.
- **`AdminVerificationModal.tsx:88-89`:** Copy states "8 institutional facts" (`8 ಪ್ರಮುಖ ವಿವರಗಳನ್ನು`) when `SCHOOL_VERIFICATION_CHECKLIST` actually contains **10** items (`vf-01` to `vf-10`).

### 3.4 Simulated Submissions Without Real Backend (Severity: HIGH)
- `OnlineServicesModal.tsx` and `ContactSection.tsx` display authoritative confirmation messages ("Application Successfully Registered!", "Thank you! Your feedback has been received", generated `GHS-DVG-2025-XXXX` / `DVG-GRV-XXXX` tickets) while only storing entries in the user's browser `localStorage`.
- If a parent clears browser storage or uses another device, the school office has **no record** of the submission. Per Phase 5 rules, the UI must never misrepresent local-only persistence as a submitted server record unless backed by a real server API.

### 3.5 Print Stylesheet Broken Scoping (Severity: MEDIUM)
- `src/index.css:72-89`: `@media print` hides `header, nav, footer, .ticker-band, .no-print, button, form`, yet:
  1. `LiveTicker.tsx` does not have the `.ticker-band` class.
  2. Non-modal `<section>` elements in `<main>` are NOT hidden when printing a modal (`NoticesSection` circular, `OnlineServicesModal` receipt, `AdminVerificationModal` checklist, or `StudentProgressTracker` report card). Printing currently prints the entire page along with the modal.

### 3.6 High-Contrast CSS Breaking `position: fixed` (Severity: MEDIUM)
- `src/index.css:23-25`: Applying `filter: contrast(120%)` to `html[data-theme="contrast"]` creates a new CSS containing block on `<html>`, which breaks `position: fixed` overlays/modals and `position: sticky` navbars across Chromium/Firefox/Safari.

### 3.7 Accessibility (WCAG 2.1 AA/AAA) Gaps (Severity: HIGH)
- **Keyboard inaccessibility in `GallerySection.tsx:81-85`:** Gallery cards are clickable `<div>` elements with no `button` element, `tabIndex`, or `Enter`/`Space` keyboard handler.
- **Incomplete ARIA tab patterns:** `NoticesSection.tsx:77`, `GallerySection.tsx:62`, `StudentProgressTracker.tsx:461` set `role="tablist"` without `role="tab"`, `aria-selected`, or `role="tabpanel"`.
- **Modal accessibility:** None of the 6 modals trap keyboard focus, move initial focus into the dialog, or restore focus to the trigger button on close. Close buttons in `AcademicsSection.tsx:218` and `StudentProgressTracker.tsx:857` lack `aria-label`.
- **Unlinked form labels:** Inputs in `StudentProgressTracker.tsx`, `OnlineServicesModal.tsx`, and `ContactSection.tsx` use `<label>` without `htmlFor` + matching `id`.
- **Emoji reliance:** Functional badges and status icons rely heavily on raw Unicode emojis (`🛡️`, `🍲`, `🔒`, `📋`, `⚠️`) without `aria-hidden="true"` or consistent vector icons.

---

## 4. Security, Privacy & Student Data Audit

### 4.1 Student Data Exposure in Client Bundle
- `src/data/studentRecords.ts` embeds 2 student records (`satsNo`, `regMobile`, `dob`, parent names, subject-wise marks, monthly attendance, scholarship status) directly inside the frontend bundle (`dist/assets/index-*.js`).
- Although flagged `isDemoRecord: true` and documented as fictional prototype data, the authentication gate (`StudentProgressTracker.tsx:60-65`) performs verification purely in browser memory.
- Rate limiting (`failedAttempts`, `lockoutSeconds`) and session timeout (`sessionSeconds`) are ephemeral React states that reset immediately on page reload.

### 4.2 Client-Side PII Storage
- `OnlineServicesModal.tsx` writes student names, parent names, SATS IDs, grades, and mobile numbers to `localStorage` (`ghs_davangere_service_apps`).
- `ContactSection.tsx` writes reporter names, phone numbers, and grievance text to `localStorage` (`ghs_grievances`).
- On shared devices (cyber cafés, school computer labs, community kiosks), any subsequent user can inspect `localStorage` or click "History" in `OnlineServicesModal` to read previous applicants' phone numbers and SATS IDs.

### 4.3 Administration & Authentication
- There is **no real admin authentication or backend authorization**.
- `AdminVerificationModal.tsx` is a public static checklist accessible from the top header and footer with ephemeral checkboxes. It does not support managing notices, gallery items, faculty, or academic announcements.
- **No exposed secrets:** Source scan confirmed zero hardcoded API keys, database credentials, or passwords in `src/`. `.env.example` only defines an empty `GEMINI_API_KEY=` placeholder.

---

## 5. Dependency & Configuration Audit

### 5.1 Unused Dependencies in `package.json`
The current `src/` imports **only** `react` and `react-dom`. The following installed packages are completely unused:
- **Runtime:** `@google/genai`, `express`, `dotenv`, `lucide-react`, `motion`
- **Dev:** `@types/express`, `autoprefixer`, `tsx`

**Note:** `express` and `dotenv` (along with `tsx`) become genuinely useful if we enable a real Node.js/Express backend server (see `UPGRADE_ROADMAP.md`), while `lucide-react` is ideal for accessible, lightweight icons instead of inline SVG duplication and emojis. `@google/genai`, `motion` (unless intentionally used sparingly), and `autoprefixer` (redundant with `@tailwindcss/vite`) are candidates for removal or deliberate adoption.

### 5.2 Configuration Observations
- `package.json`: `"clean": "rm -rf dist server.js"` references `server.js` (not present in repo).
- `tsconfig.json`: Configures `"paths": { "@/*": ["./*"] }` (`./*` maps to root rather than `./src/*`), and nothing in `src/` uses `@/`.
- `metadata.json`: Lists `MAJOR_CAPABILITY_SERVER_SIDE_GEMINI_API`, carried over from template; there is no AI feature in the school portal (and none should be added unless requested).
- Production bundle (`dist/assets/index-CDG_gC37.js`) is `885 KB` — unexpectedly large for a static SPA; requires bundle analysis (likely Vite/React 19 unminified/chunking check or unused tree).

---

## 6. Verification Status of School Data (Preserve vs. Verify)

Per project rules, **all existing institutional details in `SCHOOL_INFO` and `schoolData.ts` are preserved** and must not be fabricated. Notably, `SCHOOL_VERIFICATION_CHECKLIST` itself records that the following remain `Pending School Approval` against BEO/DDPI/KSEAB records:
- UDISE (`29270104501`), School Code (`DVG-GHS-042`), Estd (`1968`)
- Phone (`08192-224410`), Email (`ghs.davangere.edu@karnataka.gov.in`)
- Headmaster (`Sri B. M. Shanmukhappa`) & 9 Faculty profiles (`FACULTY_MEMBERS`, while `SCHOOL_INFO.staffCount` says `18`)
- SDMC 6-member executive roster (`SDMC_MEMBERS`, term `2024-2027`)
- Student count (`540`), SSLC pass rate (`98.4%`), Smart classes (`6`), Computers (`24`)
- Mid-Day Meal weekly nutritional metrics, Sakala/BEO/DDPI helpline numbers, and bus routes (`4, 7, 12`)

Note the minor discrepancy already present in existing data: `SCHOOL_INFO.staffCount` is `18`, while `FACULTY_MEMBERS` lists `9` named teaching staff members (the remaining 9 likely represent non-listed teaching/non-teaching/guest/cook staff, which should be clarified rather than invented).

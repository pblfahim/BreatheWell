# BreatheWell · ডিজিটাল শ্বাসপ্রশ্বাস ও সুস্থতা হাব

An offline-capable, client-side digital health platform combining evidence-based breathing protocols, clinical vital signs telemetry tracking, an optical character recognition (OCR) prescription vault, and an interactive digital prescription studio.

Engineered with native web standards: **HTML5, CSS3, Bootstrap 5.3.3, and modern ECMAScript**.

---

## Technical Highlights

- **Client-Side Privacy:** Zero personal health information (PHI) or biometric readings leave the browser. All records reside in `localStorage`.
- **Zero Build Step:** Runs directly in any modern browser without Webpack, Vite, or Node.js runtime requirements.
- **Local Asset Hosting:** 100% of vendor libraries (Bootstrap, Bootstrap Icons, DataTables, Tesseract.js, PDF.js, Google Fonts) are stored locally in `asset/vendor/`. No runtime CDN dependencies.
- **Bilingual Interface:** Full 1:1 parity between Bengali (`bn`) and English (`en`) with instantaneous language switching via reactive DOM attributes.
- **Deterministic Code Quality:** 0 inline `<style>` and 0 inline `<script>` tags across all 16 production HTML pages.

---

## Architecture Overview

```
+---------------------------------------------------------------------------------------------------+
|                                  BreatheWell Platform Layout                                      |
|                                                                                                   |
|  +--------------------+   +--------------------+   +--------------------+   +------------------+  |
|  |     index.html     |   |   exercises.html   |   |  breath-test.html  |   | prescriptions-   |  |
|  |  Home Wellness Hub |   | Guided Respiration |   |  BOLT & BPM Labs   |   | volt.html (Vault)|  |
|  +--------------------+   +--------------------+   +--------------------+   +------------------+  |
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  |                     Modular Clinical Health Tracker Suite (Vitals Engine)                   |  |
|  |  +--------------------+  +--------------------+  +--------------------+  +---------------+  |  |
|  |  | health-reading.html|  | health-charts.html |  | health-history.html|  |health-demo.html| |  |
|  |  | BP & Glucose Entry |  | SVG Analytics Band |  | DataTables 2 Log   |  | Test Scenarios|  |  |
|  |  +--------------------+  +--------------------+  +--------------------+  +---------------+  |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                                                                   |
|  +---------------------------------------------------------------------------------------------+  |
|  |                           Clinical Prescription Studio & History Suite                      |  |
|  |  +--------------------------+  +------------------------+  +-----------------------------+  |  |
|  |  | prescription-create.html |  | prescription-pad.html  |  |   digitalpad-history.html   |  |  |
|  |  | Studio Form + WYSIWYG Pad|  | Dedicated Paper Pad    |  |   Dual View Archive & Print |  |  |
|  |  +--------------------------+  +------------------------+  +-----------------------------+  |  |
|  +---------------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

---

## Table of Contents

1. [Module Breakdown](#module-breakdown)
2. [Clinical & Scientific Guidelines](#clinical--scientific-guidelines)
3. [Repository Structure](#repository-structure)
4. [Technology Stack](#technology-stack)
5. [Storage Architecture](#storage-architecture)
6. [Getting Started](#getting-started)
7. [Engineering Standards](#engineering-standards)
8. [Documentation Suite](#documentation-suite)
9. [Disclaimer](#disclaimer)

---

## Module Breakdown

### 1. Respiration Studio & Assessments
- **Guided Respiration (`exercises.html`):** 4 clinical practices (Box Breathing 4-4-4-4, 4-7-8 Relaxing, Nadi Shodhana Pranayama, Diaphragmatic Deep Belly). Animated visual pacing powered by `requestAnimationFrame`, procedural Web Audio API tones, and Web Speech API voice prompts.
- **Respiratory Diagnostic Lab (`breath-test.html`):** Body Oxygen Level Test (BOLT) stopwatch measuring functional breath-hold time, alongside a resting Breaths Per Minute (BPM) tap counter.

### 2. Clinical Vitals Telemetry
- **Telemetry Ingestion (`health-reading.html`):** Input forms for Blood Pressure (Systolic, Diastolic, Heart Rate) and Blood Glucose (Fasting, Postprandial, Random) with real-time spectrum gauges.
- **Trend Analytics (`health-charts.html` / `trends-charts.html`):** Responsive SVG time-series graphs with color-coded safe-zone target bands and hover crosshairs.
- **History & Export (`health-history.html`):** Tabular logs powered by DataTables 2, supporting RFC 4180 CSV export (with UTF-8 BOM for spreadsheet encoding) and JSON backup/restore.
- **Simulation Suite (`health-demo.html`):** Preset clinical scenarios for rapid diagnostic verification.

### 3. Prescription Vault & Digital Studio
- **Prescription Vault (`prescriptions-volt.html`):** Client-side drag-and-drop document upload with canvas downsampling (max 1200px / 72% JPEG) and local Tesseract.js v5 OCR text extraction.
- **Vault Archive (`prescription-history.html`):** Dual-format interface (Card Grid and DataTables 2 table) with fullscreen lightbox inspection.
- **Prescription Studio (`prescription-create.html`):** Two-way synchronized clinical editor paired with an authentic live WYSIWYG hospital prescription pad. Includes 1-click sample pre-fill, WhatsApp formatting, and `@media print` A4 rendering.
- **Direct Pad Editor (`prescription-pad.html`):** In-place `contenteditable` hospital paper pad with dynamic medication builders.
- **Digital Pad History (`digitalpad-history.html`):** Dual-view clinical archive for digital prescriptions with print and share modal dialogs.

### 4. Member Profile & Security
- **Authentication (`login.html`, `register.html`):** Form validation, password strength scoring, and 1-click demo access.
- **Dashboard (`profile.html`):** Vitality metrics, streak tracking, health settings, and one-click data export.

---

## Clinical & Scientific Guidelines

### Blood Pressure Classification (AHA/ACC 2017)
- **Normal:** Systolic < 120 mmHg and Diastolic < 80 mmHg
- **Elevated:** Systolic 120–129 mmHg and Diastolic < 80 mmHg
- **Stage 1 Hypertension:** Systolic 130–139 mmHg or Diastolic 80–89 mmHg
- **Stage 2 Hypertension:** Systolic ≥ 140 mmHg or Diastolic ≥ 90 mmHg
- **Hypertensive Crisis:** Systolic > 180 mmHg or Diastolic > 120 mmHg

### Glycemic Standards (ADA 2024)
- **Fasting Blood Glucose:** Normal (70–99 mg/dL), Pre-diabetes (100–125 mg/dL), Diabetes (≥ 126 mg/dL), Hypoglycemia (< 70 mg/dL).
- **Postprandial (2h):** Normal (< 140 mg/dL), Pre-diabetes (140–199 mg/dL), Diabetes (≥ 200 mg/dL).

---

## Repository Structure

```text
BreatheWell/
├── index.html                    # Main wellness landing page & interactive 3D hero slider
├── exercises.html                # Guided breathing studio with rAF timer, audio & confetti
├── breath-test.html              # Respiratory fitness assessments (BOLT score & BPM counter)
├── health-reading.html           # Vital signs telemetry entry with live AHA/ADA spectrum gauges
├── health-charts.html            # Time-series SVG charts, clinical safe zones & trend analytics
├── trends-charts.html            # Backward-compatible alias/mirror of health-charts.html
├── health-history.html           # High-density clinical records table powered by DataTables 2
├── health-demo.html              # Clinical scenario generator & LocalStorage telemetry inspector
├── prescriptions-volt.html       # Clinical prescription vault, document gallery & OCR scanner
├── prescription-history.html     # Saved prescription archive in dual card/table formats
├── prescription-create.html      # Digital doctor prescription pad creator with live WYSIWYG
├── prescription-pad.html         # Dedicated live WYSIWYG prescription pad with in-place editing
├── digitalpad-history.html       # Digital pad prescription archive with dual card/table format
├── login.html                    # Member authentication & simulated session login
├── register.html                 # Member registration & onboarding portal
├── profile.html                  # Member profile & health dashboard
│
├── asset/
│   ├── css/                      # Modular stylesheets (style.css, health-*.css, prescription-*.css)
│   ├── js/                       # Modular ES6+ controllers (global-nav.js, script.js, health-*.js)
│   ├── image/                    # Favicon and vector brand assets
│   └── vendor/                   # Locally hosted libraries (Bootstrap, DataTables, Tesseract, PDF.js)
│
└── Agent/                        # Architectural specifications, governance & agent documentation
    ├── constitutions/            # Architectural principles, coding standards & constraints
    ├── doc/                      # Project charters, milestones & feature documentation
    ├── plan/                     # Implementation roadmaps, refactoring & testing plans
    ├── prompts/                  # Operational prompts for AI engineering workflows
    ├── specs/                    # Functional, component, page, responsive & a11y specifications
    └── theme-guideline/          # Design system, color tokens, typography & spacing rules
```

---

## Technology Stack

| Component | Library / Standard | Version | Application |
| :--- | :--- | :--- | :--- |
| Markup | HTML5 | Living Standard | Semantic page layout, accessibility landmarks |
| Styles | CSS3 & Custom Tokens | Living Standard | Responsive layout, design tokens, print CSS |
| UI Framework | Bootstrap | 5.3.3 (Local) | Responsive grid, modal backdrops, offcanvas |
| Glyphs | Bootstrap Icons | 1.11.3 (Local) | Vector iconography |
| Scripting | Vanilla JavaScript | ES6+ | Reactive controllers, client storage management |
| Data Tables | DataTables 2 | 2.0+ (Local) | Tabular pagination, search, sorting |
| Table Bridge | jQuery | 3.7.1 (Local) | DataTables 2 integration bridge |
| OCR Engine | Tesseract.js | v5 (Local) | Client-side optical character recognition |
| Document Engine | PDF.js | 3.11+ (Local) | In-browser PDF canvas rasterization |
| Audio Engine | Web Audio API | Native Browser | Procedural sound generation without audio files |

---

## Storage Architecture

All persistent data is stored in the browser's `localStorage` under distinct keys:

| Key | Contents | Format |
| :--- | :--- | :--- |
| `bw_vitals_records` | Blood pressure and glucose telemetry history | JSON array of measurement objects |
| `bw_prescriptions` | Uploaded and scanned prescription records | JSON array of metadata and base64 images |
| `bw_digitalpad_prescriptions` | Clinical prescriptions authored in studio/pad | JSON array of structured medical records |
| `bw_bolt_history` | Body Oxygen Level Test assessment logs | JSON array of timing results |
| `bw_user_profile` | Member session information, streak, goals | JSON user profile object |
| `bw_lang` | Active interface language (`bn` or `en`) | Plain text string |

---

## Getting Started

Because BreatheWell relies on native web standards and locally hosted vendor packages, it requires no build tools or package managers.

1. Clone or download the repository:
   ```bash
   git clone https://github.com/your-organization/BreatheWell.git
   cd BreatheWell
   ```
2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).
3. The application is immediately operational and functions fully offline.

---

## Engineering Standards

- **Zero Inline Code Policy:** All HTML files maintain 0 inline `<style>` and 0 inline `<script>` tags.
- **Deterministic Script Mirroring:** Byte-for-byte SHA256 equality is maintained between `asset/js/script.js` and `asset/js/script.jt`.
- **Hero Tab Bar Consistency:** The `.ht-hero-tab-bar` strictly inherits master styles from `asset/css/style.css` across all modular suites.
- **Accessibility:** Minimum touch targets of 44x44px, skip navigation links, and WCAG 2.1 AA color contrast compliance.

---

## Documentation Suite

Comprehensive specifications and governance guidelines are located in the `Agent/` directory:

- **[Specifications](Agent/specs/):** Functional requirements, component specs, page specs, responsive design, accessibility.
- **[Theme Guidelines](Agent/theme-guideline/):** Design system tokens, color palettes, typography, spacing, and styling rules.
- **[Engineering Plans](Agent/plan/):** Implementation plans, forward roadmap, refactoring, and QA testing protocols.
- **[Constitutions](Agent/constitutions/):** Architectural mandates, coding conventions, UI/UX laws, and constraints.
- **[Agent Prompts](Agent/prompts/):** Context prompts for AI-assisted engineering and reviews.

---

## Disclaimer

BreatheWell is an educational, personal health tracking, and mindful breathing tool. It is not a certified medical device and does not provide formal medical diagnoses, clinical treatment plans, or emergency triage. Users experiencing acute health symptoms or medical emergencies should contact licensed medical professionals immediately.

---

## License

This project is distributed under the terms of the **MIT License**.

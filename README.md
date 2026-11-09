# BreatheWell (ডিজিটাল শ্বাসপ্রশ্বাস ও সুস্থতা হাব)

> **Enterprise-Grade, Privacy-First Bilingual Respiratory Wellness & Clinical Health Tracking Platform**  
> *Engineered with Vanilla Web Standards: HTML5, CSS3, Bootstrap 5.3.3, and ES6+ JavaScript.*

---

## 1. Executive Summary & Architecture Overview

**BreatheWell** is an offline-capable, client-side digital health and mindful respiration web application. It combines evidence-based breathing protocols, clinical vital signs telemetry tracking, an intelligent prescription vault with dual-engine optical character recognition (OCR), and an interactive digital prescription creator studio.

All patient biometrics, prescription scans, and exercise telemetry reside exclusively in the client's local storage (`localStorage`). **Zero bytes of personal health information (PHI) leave the user's browser.**

```
+---------------------------------------------------------------------------------------------------+
|                                  BreatheWell Page Architecture                                    |
|                                                                                                   |
|  +--------------------+   +--------------------+   +--------------------+   +------------------+  |
|  |     index.html     |   |   exercises.html   |   |  breath-test.html  |   | prescriptions.html| |
|  |  Home Wellness Hub |   | Guided Respiration |   |  BOLT & BPM Labs   |   | Vault & OCR Lab  |  |
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
|  |                     create-prescription.html (Digital Rx Creator Studio)                    |  |
|  |  - Two-Way Synchronized Editor & WYSIWYG Digital Doctor Prescription Pad                     |  |
|  |  - Automated Clinical OCR Ingestion, Medication Builder & WhatsApp / Print Dispatch         |  |
|  +---------------------------------------------------------------------------------------------+  |
|  |                     prescription-pad.html (Live Dedicated Prescription Pad)                 |  |
|  |  - Direct In-Place Real-Time Contenteditable WYSIWYG Hospital Paper Pad                    |  |
|  |  - Pure Canvas Layout Without External Forms; Dynamic Chip Lists, Presets & 1-Click Vault   |  |
|  +---------------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Directory Layout & Module Structure

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
├── prescriptions.html            # Clinical prescription vault, document gallery & OCR scanner
├── create-prescription.html      # Digital doctor prescription pad creator with live WYSIWYG
├── prescription-pad.html         # Dedicated live WYSIWYG prescription pad with direct in-place editing
│
├── asset/
│   ├── css/
│   │   ├── style.css             # Core design system tokens, hero 3D carousel, breathing animation
│   │   ├── prescriptions.css     # Prescription vault gallery, drag-and-drop zone & lightbox
│   │   ├── create-prescription.css # Studio editor layout, WYSIWYG digital pad & print styles
│   │   ├── prescription-pad.css  # Dedicated live paper pad styles, in-place edit & print rules
│   │   ├── health-reading.css    # Segmented entry forms, pull-up stats & live spectrum meters
│   │   ├── health-charts.css     # SVG line chart containers, target safe bands & tooltips
│   │   ├── health-history.css    # DataTables 2 Bootstrap 5 overrides, badges & export buttons
│   │   ├── health-demo.css       # Clinical scenario preset cards & custom parametric panel
│   │   └── health-tracker.css    # Monolithic health tracker design tokens (legacy fallback)
│   │
│   ├── js/
│   │   ├── script.js             # Core application engine (breathing, routing, audio, TTS, i18n)
│   │   ├── script.jt             # Byte-for-byte SHA256 mirror of script.js
│   │   ├── prescriptions.js      # Vault engine: Tesseract.js v5 OCR, PDF parser, regex extraction
│   │   ├── create-prescription.js # Digital prescription studio engine & live pad preview
│   │   ├── prescription-pad.js   # Live paper pad controller, in-place edit sync & clinical presets
│   │   ├── health-reading.js     # Vitals entry controller, AHA/ADA classification & meters
│   │   ├── health-charts.js      # Responsive SVG time-series charts, sparklines & smart insights
│   │   ├── health-history.js     # DataTables 2 controller, RFC 4180 CSV & JSON backup exporter
│   │   ├── health-demo.js        # Synthetic clinical test dataset generator & storage inspector
│   │   └── health-tracker.js     # Monolithic health tracker controller (backward compatibility)
│   │
│   └── images/                   # Optimized vector graphics, hero illustrations & brand assets
│
├── doc/                          # Technical documentation, project charter, milestones & specs
│   ├── FEATURE_DOCUMENTATION.md  # Detailed technical specifications for every module
│   ├── PROJECT_CHARTER.md        # Official charter, risk matrix & development governance
│   ├── MILESTONES.md             # Release history and roadmap milestones
│   └── README.md                 # Documentation suite guide
└── README.md                     # Root project documentation (this file)
```

---

## 3. Core Features & Scientific Guidelines

### 3.1 Guided Respiration Engine (`exercises.html` / `script.js`)
- **Evidence-Based Practices:**
  - *Box Breathing (4-4-4-4):* Autonomic regulation and acute stress mitigation (Navy SEAL protocol).
  - *4-7-8 Breathing:* Parasympathetic activation and insomnia reduction (Dr. Andrew Weil).
  - *Diaphragmatic Breathing (Deep Belly):* Vagal nerve stimulation and pulmonary efficiency.
  - *Natural Mindful Breathing:* Unpaced somatosensory awareness and meditation.
- **Precision Timing:** Sub-millisecond animation loop orchestrated via `window.requestAnimationFrame` synced with harmonic Web Audio chime synthesis and browser `SpeechSynthesis` audio cues.
- **Progression System:** Beginner, Intermediate, and Advanced cadences with automated celebration confetti particle simulations.

### 3.2 Respiratory Assessments Lab (`breath-test.html`)
- **Body Oxygen Level Test (BOLT):** Measures functional breath-hold time following a normal exhalation; evaluates carbon dioxide tolerance and physiological breathing efficiency.
- **Resting BPM Counter:** Touch/click cadence counter calculating resting respiratory rate per minute with tachypnea/bradypnea threshold indicators.

### 3.3 Clinical Vital Signs Telemetry (`health-reading.html`, `health-charts.html`, `health-history.html`)
- **Blood Pressure Diagnostic Spectrum (AHA/ACC 2017 Standard):**
  - *Normal:* Systolic < 120 mmHg and Diastolic < 80 mmHg.
  - *Elevated:* Systolic 120–129 mmHg and Diastolic < 80 mmHg.
  - *Hypertension Stage 1:* Systolic 130–139 mmHg or Diastolic 80–89 mmHg.
  - *Hypertension Stage 2:* Systolic 140–179 mmHg or Diastolic 90–119 mmHg.
  - *Hypertensive Crisis:* Systolic ≥ 180 mmHg or Diastolic ≥ 120 mmHg.
- **Blood Glucose Glycemic Spectrum (ADA 2024 / WHO Standard):**
  - Multi-context categorization across *Fasting*, *Post-prandial (2h after meal)*, *Random*, and *Bedtime*.
  - Strict classification across *Hypoglycemia*, *Normal*, *Pre-diabetes (Impaired Glucose Tolerance)*, and *Diabetes*.
- **Interactive SVG Time-Series Analytics:**
  - Real-time Bézier curves with interactive hover tooltips.
  - Color-shaded clinical safe zones (green target bands) for instant compliance verification.
  - Timeframe window filtering (7 Days, 14 Days, 30 Days, All History).
- **Clinical Data Management:**
  - High-density tabular views powered by **DataTables 2** with Bootstrap 5 integration.
  - Standards-compliant RFC 4180 CSV export with UTF-8 Byte Order Mark (BOM) for seamless Microsoft Excel rendering.
  - Full JSON database backup and restoration.

### 3.4 Prescription Vault & Dual-Engine OCR (`prescriptions.html`, `create-prescription.html`)
- **Dual-Engine Text Extraction:**
  1. *Vector PDF Extraction:* Decodes PDF stream objects (`/Tj`, `/TJ`) with character map extraction for digital vector prescriptions.
  2. *Tesseract.js v5 OCR:* Client-side optical character recognition supporting combined Bengali + English (`ben+eng`) trained language models.
- **Deterministic Clinical Regex Parser:** Automatically isolates:
  - Doctor name, BMDC registration number, qualifications, and hospital/chamber details.
  - Patient demographics (name, age, sex, date).
  - Vitals examination (BP, pulse, temperature, weight).
  - Chief complaints (C/C), history of illness (H/O), and recommended investigations (Inv).
  - Structured pharmaceutical prescriptions (brand, form, strength, dosage regimen e.g. `1+0+1`, meal timing, duration).
- **WYSIWYG Digital Doctor Prescription Pad:** Real-time two-way synchronization between input forms and an authentic clinical hospital prescription pad, complete with print layout (`@media print`) and WhatsApp sharing.

---

## 4. Software Architecture Invariants & Standards

Every contributor and automated tool must respect the following strict engineering invariants:

1. **Zero-Inline Code Policy:**
   - **0 inline `<style>` tags** and **0 inline `<script>` tags** across all 10 HTML pages.
   - All styling resides in `asset/css/`; all logic resides in `asset/js/`.
   - Dynamic templates must use utility classes (e.g. `.small`, `.text-muted`) rather than inline `style="..."` attributes.
2. **Deterministic Script Mirroring:**
   - `asset/js/script.js` and `asset/js/script.jt` must remain **100% byte-for-byte identical** at all times.
   - Any modifications to application logic must be synchronized across both files with identical SHA256 hashes.
3. **Semantic HTML Tag Balance:**
   - Every opening container tag (`<div`, `<nav`, `<section`, `<footer`) must have a matching closing tag.
   - Net tag difference (`open - close`) must strictly equal `0`.
4. **Bilingual Localization Parity (i18n):**
   - 100% dictionary key parity between Bengali (`bn`) and English (`en`) across all localization objects (`T`, `RX_T`, `CP_T`, `HR_T`, `HC_T`, `HH_T`, `HD_T`).
   - Default language is Bengali (`bn`) with immediate client-side persistence in `localStorage`.
5. **Industry-Standard Code Documentation:**
   - Every file features a top-level architectural docblock detailing `@file`, `@module`, `@description`, `@author`, `@version`, `@license`, and a 10-point Table of Contents.
   - All public and internal functions are annotated with complete JSDoc docstrings (`@function`, `@param`, `@returns`, `@throws`).
   - Major structural milestones are separated by standardized section landmark headers.

---

## 5. Verification & Test Suite

The project includes an automated PowerShell test harness that verifies all architectural invariants:

```powershell
# Run the complete test suite from repository root:
powershell -ExecutionPolicy Bypass -File "scratch/verify_project_suite.ps1"
```

The test harness evaluates:
- **Zero-Inline Audit:** Verifies 0 `<style>` tags and 0 `<script>` tags across all HTML files.
- **Semantic Tag Balance:** Confirms `div diff = 0`, `nav diff = 0`, and `footer diff = 0`.
- **SHA256 Parity:** Validates cryptographic identity between `asset/js/script.js` and `asset/js/script.jt`.
- **Localization Key Parity:** Verifies identical key sets between `bn` and `en` across all language dictionaries.

---

## 6. How to Run & Deploy

BreatheWell requires **zero build tools, zero server runtimes, and zero package installations**.

1. Clone or download the repository to your local machine:
   ```bash
   git clone https://github.com/your-username/BreatheWell.git
   cd BreatheWell
   ```
2. Open `index.html` in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Apple Safari).
3. **Offline Access:** The application functions completely offline for breathing exercises, vitals recording, and local prescription creation. A network connection is only needed on initial load to fetch CDN vendor libraries (Bootstrap 5.3.3, Bootstrap Icons, Google Fonts, and Tesseract.js).

---

## 7. Medical & Clinical Disclaimer

> **IMPORTANT:** BreatheWell is a personal wellness, mindfulness, and health-tracking tool. It is **not** a certified medical device, diagnostic system, or replacement for professional clinical judgment. Users experiencing severe hypertension, hypotension, glycemic crisis, or acute respiratory distress must immediately consult a licensed physician or seek emergency medical care.

---

## 8. License

This project is licensed under the **MIT License**. See the repository header docblocks for full permissions and copyright details.

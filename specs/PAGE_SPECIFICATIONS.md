# BreatheWell — Page Specifications

> **Document ID:** BW-SPEC-PAGES-2026  
> **Version:** 2.4.0  
> **Classification:** Page-by-Page Technical & Architectural Specification  

---

## 1. Overview

BreatheWell comprises **16 HTML pages** organized into four coherent clinical and mindful wellness domains:
1. **Wellness Core:** `index.html`, `exercises.html`, `breath-test.html`.
2. **Clinical Vitals Suite:** `health-reading.html`, `health-history.html`, `health-charts.html` (and alias `trends-charts.html`), `health-demo.html`.
3. **Prescription Suite:** `prescriptions-volt.html`, `prescription-history.html`, `prescription-create.html`, `prescription-pad.html`, `digitalpad-history.html`.
4. **Member & Identity Suite:** `login.html`, `register.html`, `profile.html`.

Every page follows the strict **Zero Inline Code Policy** (0 inline `<style>`, 0 inline `<script>`), contains a top accessibility skip link, and integrates with the unified global navigation engine (`global-nav.js`).

---

## 2. Page Directory & Technical Matrix

| Page File | Page Title (Bengali / English) | Primary CSS | Primary JS | Core Functionality |
| :--- | :--- | :--- | :--- | :--- |
| `index.html` | হোম \| BreatheWell | `style.css` | `script.js` | Landing page, 3D carousel, quick launcher, SOS emergency center |
| `exercises.html` | শ্বাস ব্যায়াম \| BreatheWell | `exercises.css` | `exercises.js` | Guided breathing studio, 4 modalities, rAF ring timer, audio chimes |
| `breath-test.html` | শ্বাসের পরীক্ষা \| BreatheWell | `breath-test.css` | `breath-test.js` | BOLT assessment stopwatch & resting BPM pulse counter |
| `health-reading.html` | নতুন রিডিং \| হেলথ ট্র্যাকার | `health-reading.css` | `health-reading.js` | BP & Glucose entry, AHA/ADA live gauge, pull-up metrics |
| `health-history.html` | ইতিহাস লগ \| হেলথ ট্র্যাকার | `health-history.css` | `health-history.js` | DataTables 2 clinical history log, CSV & JSON backup exporter |
| `health-charts.html` | ট্রেন্ড চার্ট \| হেলথ ট্র্যাকার | `health-charts.css` | `health-charts.js` | Responsive SVG time-series charts, safe-zone analytics |
| `trends-charts.html` | ট্রেন্ড চার্ট (মিরর) | `health-charts.css` | `health-charts.js` | Backward-compatible alias/mirror of health-charts.html |
| `health-demo.html` | নমুনা ডেটা \| হেলথ ট্র্যাকার | `health-demo.css` | `health-demo.js` | Synthetic clinical scenario generator & storage inspector |
| `prescriptions-volt.html` | প্রেসক্রিপশন ভল্ট \| BreatheWell | `prescriptions-volt.css` | `prescriptions-volt.js` | Document upload, Tesseract.js client OCR scanner, refill alerts |
| `prescription-history.html` | সংরক্ষিত প্রেসক্রিপশন ইতিহাস | `prescription-history.css` | `prescription-history.js` | Saved vault prescriptions in dual view (Card grid + DataTables 2) |
| `prescription-create.html` | প্রেসক্রিপশন তৈরি \| BreatheWell | `prescription-create.css` | `prescription-create.js` | Studio editor + live WYSIWYG hospital paper pad, print & share |
| `prescription-pad.html` | ডিজিটাল প্যাড \| BreatheWell | `prescription-pad.css` | `prescription-pad.js` | Dedicated live WYSIWYG paper pad with in-place editable fields |
| `digitalpad-history.html` | ডিজিটাল প্যাড ইতিহাস ও রেকর্ডস | `digitalpad-history.css` | `digitalpad-history.js` | Clinical archive of digital pad records (Dual view & modal viewer) |
| `login.html` | লগইন \| BreatheWell | `login.css` | `login.js` | Local authentication, 1-click healthcare demo login, PIN recovery |
| `register.html` | রেজিস্ট্রেশন \| BreatheWell | `register.css` | `register.js` | Member onboarding, password strength scoring, health goal setup |
| `profile.html` | সদস্য প্রোফাইল \| BreatheWell | `profile.css` | `profile.js` | Health metrics dashboard, JSON export, session management |

---

## 3. Detailed Page Breakdown

### 3.1 Wellness Core

#### `index.html` (Wellness Landing Hub)
- **Landmarks:** `#hero-slider`, `#exercises-preview`, `#health-preview`, `#safety`.
- **Key Components:**
  - Interactive 3D CSS perspective hero carousel showcasing respiratory exercises.
  - Emergency SOS Calm Breathing guide (4 immediate stabilizing steps).
  - Quick launcher linking directly to breathing exercises, tests, and vitals.
- **Data Attributes:** `data-page="home"`.

#### `exercises.html` (Guided Respiration Studio)
- **Landmarks:** `#practice-picker`, `#session-stage`, `#session-complete-modal`.
- **Key Components:**
  - Protocol picker: Box (4-4-4-4), 4-7-8, Nadi Shodhana, Diaphragmatic.
  - Difficulty toggle: Beginner, Intermediate, Advanced.
  - Central respiration ring with rAF easing, dual-tone Web Audio chimes, and TTS voice coaching.
  - Canvas confetti particle engine upon session completion.

#### `breath-test.html` (Respiratory Diagnostic Lab)
- **Landmarks:** `#bolt-section`, `#bpm-section`.
- **Key Components:**
  - BOLT stopwatch with start/stop trigger, clinical feedback tier, and local telemetry log.
  - Resting BPM tap counter with 60s countdown and rate extrapolation.

---

### 3.2 Clinical Vitals Telemetry Suite

#### `health-reading.html` (Vital Signs Telemetry Entry)
- **Header:** Sticky Dark Green Tab Bar (`.ht-hero-tab-bar`) with 4 tabs (নতুন রিডিং, ইতিহাস লগ, ট্রেন্ড চার্ট, নমুনা ডেটা).
- **Key Components:**
  - Blood Pressure form (Systolic, Diastolic, Pulse) with real-time AHA 2017 category classification.
  - Blood Glucose form (mg/dL or mmol/L, Fasting/Postprandial/Random) with ADA 2024 spectrum meter.
  - Floating pull-up card showing latest logged readings and 7-day averages.

#### `health-history.html` (Clinical Log & Export)
- **Key Components:**
  - DataTables 2 integration displaying date, reading, category badge, and notes.
  - Category filter pills (All, Normal, Elevated, High).
  - CSV Export button (RFC 4180 standard, UTF-8 BOM).
  - JSON Backup / Restore modal.

#### `health-charts.html` / `trends-charts.html` (SVG Trend Analytics)
- **Key Components:**
  - Responsive inline SVG time-series charts for Systolic, Diastolic, and Blood Glucose.
  - Color-coded safe zone target bands.
  - Interactive crosshairs and hovering SVG tooltips.

#### `health-demo.html` (Clinical Scenario Generator)
- **Key Components:**
  - 1-click synthetic clinical test data presets (Normal Healthy Adult, Borderline Pre-hypertensive, Diabetic Patient, Hypotensive).
  - Telemetry database inspector with raw JSON viewer and reset capability.

---

### 3.3 Clinical Prescription Suite

#### `prescriptions-volt.html` (Prescription Vault & Scanner)
- **Header:** Sticky Dark Green Tab Bar (`.ht-hero-tab-bar`) with 5 tabs (প্রেসক্রিপশন ভল্ট, প্রেসক্রিপশন ইতিহাস, ডিজিটাল প্যাড ইতিহাস, প্রেসক্রিপশন তৈরি, ডিজিটাল প্যাড).
- **Key Components:**
  - Drag-and-drop file ingestion zone with automatic HTML5 canvas downsampling (max 1200px / 72% JPEG).
  - In-browser Tesseract.js v5 OCR extraction engine.
  - Document gallery with urgency badges and medication refill countdowns.

#### `prescription-history.html` (Saved Vault History)
- **Key Components:**
  - Segmented view format toggle: **Format A (Card Grid)** vs. **Format B (DataTables 2 Table)**.
  - High-resolution fullscreen lightbox viewer (`#phLightbox`) for inspecting uploaded prescriptions and multi-page PDFs.

#### `prescription-create.html` (Digital Prescription Studio)
- **Key Components:**
  - Left Panel: Form fields for Doctor, Patient, Vitals, C/C, O/E, Inv, Dx, Medicines, and Advice.
  - Right Panel: Live WYSIWYG preview of an authentic hospital prescription sheet (Dr. A. Rahman, City General Hospital letterhead).
  - 1-Click "Load Sample (From PDF)" populating pre-configured clinical sample data.
  - Action buttons: Print (`@media print`), WhatsApp Share, and Save to Vault.

#### `prescription-pad.html` (Dedicated Live Paper Pad)
- **Key Components:**
  - WYSIWYG hospital paper pad with direct in-place editable elements (`contenteditable="true"`).
  - Zero external forms; edits happen directly on the sheet.
  - Synchronizes to `bw_digitalpad_prescriptions` and general vault.

#### `digitalpad-history.html` (Digital Pad Archive)
- **Key Components:**
  - Dual view toggle (Card Grid and DataTables 2 Table) matching `prescription-history.html`.
  - Full clinical modal viewer (`#dhDetailModal`) with letterhead, vitals, Rx schedule table, advice, print, and WhatsApp share.

---

### 3.4 Member & Identity Suite

#### `login.html` & `register.html`
- **Key Components:**
  - Glassmorphic auth cards with ambient mindful glow rings.
  - 1-Click "Healthcare Demo Login" for evaluator convenience.
  - Password strength validation bar with live criterion badges.

#### `profile.html` (Member Health Dashboard)
- **Key Components:**
  - Member identity hero card with customizable avatar.
  - 4-pillar vitality indicators: Total Mindful Minutes, Completed Sessions, BOLT Score, Streak Days.
  - Full data management: Export All Data (JSON) and Wipe Data.

# BreatheWell — Comprehensive Feature-Based Documentation

> **Version:** 1.5.0  
> **Classification:** Technical & Functional Product Specification  
> **Status:** Released & Operational  
> **Repository:** `j:\Development\BreatheWell`  
> **Target Audience:** Developers, Medical Informatics Reviewers, UI/UX Engineers, Healthcare Providers  

---

## 1. Executive Summary & Product Vision

**BreatheWell** (ডিজিটাল শ্বাসপ্রশ্বাস ও সুস্থতা হাব) is an accessible, bilingual (Bengali / English), privacy-first digital health and mindful respiration platform. Engineered with high-performance vanilla web standards (HTML5, CSS3, Bootstrap 5.3.3, and ES6+ JavaScript), BreatheWell delivers a zero-latency, zero-cloud-dependency clinical wellness suite directly inside any modern web browser.

### 1.1 Core Value Proposition
- **Total Data Privacy:** Zero patient telemetry or health metrics leave the client device; all biometric vitals, prescriptions, and session histories reside exclusively in client-side storage (`localStorage`).
- **Zero-Friction Access:** No mandatory account creation, paywalls, or cloud dependencies.
- **Evidence-Based Clinical Foundation:** Implements validated respiratory modalities (Box Breathing, 4-7-8, Diaphragmatic Breathing) alongside standard clinical assessments (Body Oxygen Level Test, Resting BPM) and clinical monitoring guidelines (AHA Blood Pressure, ADA Blood Glucose).
- **Dual-Language Inclusivity:** First-class native Bengali (`bn`) and English (`en`) support with instantaneous language swapping and 100% dictionary key parity.

---

## 2. System Architecture & Engineering Principles

```
+-----------------------------------------------------------------------------------------+
|                                  User Interface Layer                                   |
|  +----------------+  +---------------+  +-------------+  +-----------+  +-------------+ |
|  |   Home Hub     |  | Breathing Lab |  | Breath Test |  | Vitals    |  | Create Rx   | |
|  |  (index.html)  |  | (exercises)   |  | (bolt / bpm)|  | (tracker) |  | (Studio Pad)| |
|  +----------------+  +---------------+  +-------------+  +-----------+  +-------------+ |
|  +-----------------------------------+  +---------------------------------------------+ |
|  |  Prescription Vault (prescriptions)|  | Responsive Mobile Drawer & Bottom App Bar   | |
|  +-----------------------------------+  +---------------------------------------------+ |
+-----------------------------------------------------------------------------------------+
|                                Application Logic Engines                                |
|  +-----------------+  +-----------------+  +----------------------+  +----------------+ |
|  |  Cadence & TTS  |  |  Chart & Gauges |  | Client OCR & Gallery |  | Rx Pad Creator | |
|  |  (script.js/.jt)|  | (health-tracker)|  |  (prescriptions.js)  |  | (create-rx.js) | |
|  +-----------------+  +-----------------+  +----------------------+  +----------------+ |
|  +------------------------------------------------------------------------------------+ |
|  |                 Bilingual i18n Localization Engine (255 keys & 100% Parity)        | |
|  +------------------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------------+
|                                Storage & Security Layer                                 |
|  +-------------------------+    +-------------------+    +----------------------------+ |
|  | LocalStorage Repository |    | Salted Hash PIN   |    | Obfuscated Base64 Share    | |
|  | (JSON Schema Versioned) |    | Security Engine   |    | & Pixel-Perfect PDF Print  | |
|  +-------------------------+    +-------------------+    +----------------------------+ |
+-----------------------------------------------------------------------------------------+
```

### 2.1 Architectural Pillars
1. **Zero Inline Code Policy:** 100% strict separation of concerns. Zero inline `<style>` and zero inline `<script>` tags across all HTML pages, enforcing modern Content Security Policy (CSP) compliance.
2. **Deterministic Script Mirroring:** Core application logic is maintained with absolute byte-for-byte SHA256 parity between `asset/js/script.js` and `asset/js/script.jt`.
3. **High Resiliency Offline First:** Fully operable without server roundtrips or backend APIs.
4. **Universal Semantic HTML:** Perfect tag balances (`div`, `section`, `nav`, `footer`) validated via automated CI test scripts.

---

## 3. Module Breakdown & Functional Specifications

---

### Module 1: Universal Navigation & Mobile Sidebar Drawer

#### 1.1 Desktop Navigation Bar (`>= 992px`)
- **Location:** Sticky top navbar across all pages.
- **Brand Identity:** High-contrast SVG vector wind logo and responsive typography.
- **Navigation Links:** Active link indicators dynamically matched to current URL (`index.html`, `exercises.html`, `breath-test.html`, `health-tracker.html`, `prescriptions.html`, `create-prescription.html`).
- **Interactive Language Switcher:** Dual-pill toggle (`বাং` / `EN`) with instant DOM re-rendering and persistence to `localStorage.getItem("bw_lang")`.

#### 1.2 Mobile Bottom Application Bar (`< 992px`)
- **Fixed Position:** Bottom screen dock with touch-optimized target sizes (minimum 48x48px).
- **Primary Quick Tabs:** `Home`, `Exercises`, `Breath Test`, and `More / আরও` drawer trigger.

#### 1.3 Sliding Mobile Sidebar Drawer (`#mobileSidebarMenu`)
- **Offcanvas Drawer:** Slides smoothly from right viewport on touch devices.
- **Component Sections:**
  1. Brand Header with logo, title, and close button.
  2. Language Selector card (Bengali / English).
  3. Main Navigation Links (6 full-width cards with active indicators).
  4. Quick Action Utilities: Emergency SOS with pulse alert, and quick module shortcuts.
  5. Clinical Disclaimer footer.

---

### Module 2: Home Wellness Hub (`index.html`)

- **Interactive Breathing Companion ("Breathe with Buddy"):** Click-reactive breathing mascot with custom canvas heart burst particle simulation (`spawnBuddyHearts()`).
- **Ambient Breathing Guide:** Soft pulsing halo pacing natural inhalation and exhalation rhythms.
- **Featured Practices Carousel & Deep Linking:** Dynamic cards for all 4 breathing methods with URL parameter launching (`exercises.html?exercise=box&action=start`).
- **Emergency Guidance & Medical Safety Hub (`#safety`):**
  - Red flag clinical warnings for acute respiratory distress, severe chest pressure, or syncope.
  - Step-by-step 4-step crisis protocol (sit upright, pursed-lip breathing, rescue inhaler, call 999).
  - Pre-exercise interactive safety checklist.
  - National emergency hotline directory (Bangladesh 999, Health Helpline 16263, Govt 333).

---

### Module 3: Guided Breathing Studio (`exercises.html`)

- **4 Evidence-Based Practices:**
  1. **Box Breathing (4-4-4-4):** Equal autonomic stabilization used by clinical therapists.
  2. **4-7-8 Relaxing Breath:** Parasympathetic activation and rapid sleep induction.
  3. **Diaphragmatic Deep Breathing:** Abdominal expansion and pulmonary re-education.
  4. **Mindful Awareness Breathing:** Open interoceptive unforced breath monitoring.
- **3 Difficulty Tiers:** Beginner, Intermediate, and Advanced with dynamically scaled phase intervals.
- **Interactive Session Engine:** Dynamic SVG breathing circle visualizer, Web Audio API harmonic chime transitions, and Web Speech Synthesis vocal cues in English and Bengali.
- **Completion Celebration:** Canvas physics-based confetti engine (55 spinning particles), post-session mood check-in, and persistent streak tracker (`bw_streak_count`, `bw_total_mins`).

---

### Module 4: Respiratory Assessments Lab (`breath-test.html` & `test.html`)

- **Body Oxygen Level Test (BOLT):**
  - Millisecond-accurate digital stopwatch measuring post-exhalation CO2 tolerance.
  - Stratified clinical feedback: `<10s` (Critical), `10-20s` (Sub-optimal), `20-30s` (Moderate), `30s+` (Optimal).
  - Dynamic breathing practice recommendations based on score.
- **Resting Breaths Per Minute (BPM) Tap Counter:**
  - Rolling average tap detector with physiological classification (<12 Bradypnea, 12-20 Normal, >20 Tachypnea).
- **Telemetry Log:** Timestamped local history persisted in `bw_bolt_history` and `bw_bpm_history` with social/clinical export.

---

### Module 5: Clinical Vitals Health Tracker (`health-tracker.html`)

- **Blood Pressure (BP) Module:**
  - Dual systolic / diastolic inputs with arm selection (Left/Right) and interactive live spectrum slider.
  - One-click presets: Normal (120/80), Elevated (128/82), Stage 1 (135/88), Stage 2 (155/96).
  - 2017 AHA classification with prominent Hypertensive Crisis visual alarms.
- **Blood Glucose (BG) Module:**
  - Glycemic value with meal timing context: Fasting, Post-meal (2hr), Random, Bedtime.
  - ADA diagnostic ranges and severe hypoglycemia shock warnings (<70 mg/dL) with Rule-of-15 emergency instructions.
- **Analytics & Portability:**
  - Custom SVG inline sparklines and multi-timeframe trend charts (7D, 30D, 90D, All).
  - RFC 4180 CSV export for doctors, schema-validated JSON backup/restore with staging preview, and WhatsApp summary generator.
  - 4-digit family PIN security lock with salted SHA256 hashes.

---

### Module 6: Prescription & Medication Vault (`prescriptions.html`)

- **Image Compression & Storage Guard:** In-browser canvas downsampling (max 1200px, 72% JPEG quality) to prevent storage exhaustion, with 4MB quota warning meter.
- **Regex-Driven Client OCR:** Auto-extracts doctor name, clinic, date, and medications from pasted or scanned text.
- **Medication Scheduling & Refill Intelligence:** Interactive medicine tags with dosage timings and automated refill countdown alerts (e.g., "Refill needed in 3 days").
- **Lightbox Gallery:** Filterable by doctor, diagnosis, and active status, with fullscreen image viewer and carousel navigation.

---

### Module 7: Digital Prescription Creator Studio (`create-prescription.html`)

> Modeled directly on modern hospital prescription pad architecture (Dr. A. Rahman, City General Hospital layout).

#### 7.1 Architecture & Split-View Experience
- **Dedicated Application Engine:** `asset/js/create-prescription.js` & `asset/css/create-prescription.css`.
- **Left Column: Interactive Clinical Editor:**
  - **Doctor & Clinic Card:** Doctor name, qualifications/degrees, registration number, hospital/clinic name, address, and phone hotline.
  - **Patient Information Card:** Patient name, age, sex (M/F/Other), and consultation date.
  - **Clinical Examination & History (O/E):**
    - Dynamic chip adders for **C/C** (Chief Complaints, e.g. `Fever x 3 days`, `Headache`).
    - Dynamic chip adders for **H/O** (History of Past Illness, e.g. `DM x 5 years`).
    - Key vitals inputs (**O/E**): BP (`120/80`), Pulse (`72`), Temp (`98.6°F`), Weight (`65 kg`).
    - Dynamic chip adders for **Inv.** (Investigations, e.g. `CBC`, `Random Blood Sugar`).
  - **Treatment & Medications (Rx):**
    - Diagnosis field (**Dx:** e.g. `Viral Fever (Suspected) - Flu`).
    - Quick slash command `/` to jump directly into the medicine adder.
    - Popular medicine presets (Napa Extend, Fexo, Omeprazole, Montelukast, ORS).
    - Structured medicine entry: Brand Name, Dosage Form (Tab/Cap/Syr/Inj/Drops/Sachet), Dosage Schedule (`1+0+1`, `1+1+1`), Relation to Food (`After meal`, `Before meal`), Duration (`5 days`), and Instructions.
    - Editable medicines table with inline cell updates and quick trash deletion.
    - Doctor's advice multiline textarea.
- **Right Column: WYSIWYG Digital Prescription Pad (Paper View):**
  - Recreates the exact look and feel of the physical hospital prescription pad:
    - High-elevation paper canvas with authentic typography.
    - Doctor header on left, City General Hospital branding on right with contact details.
    - Patient metadata bar with dashed border.
    - Left column with C/C, H/O, O/E table with dotted leaders, and Inv.
    - Right column with Dx, stylized cursive `Rx` symbol, numbered medicine schedule, and Advice.
    - Doctor's signature line and institutional seal at the bottom.
- **Integrated Action Toolbar:**
  - ⚡ **"Load Sample (From PDF)":** Instantly loads the exact data from the clinical PDF file.
  - 🧹 **"New / Clear":** Clears all fields to create a fresh patient prescription.
  - 🖨️ **"Print / Save PDF":** Activates dedicated `@media print` rules, suppressing all web chrome, navigation, buttons, and toasts to produce an authentic hospital prescription sheet on A4 paper.
  - 💾 **"Save to Vault":** Saves the structured record directly into `bw_prescriptions` in `localStorage`, syncing automatically with the gallery in `prescriptions.html`.
  - 📱 **"Share WhatsApp":** Generates an internationally formatted clinical summary for instant WhatsApp transmission to patients, family members, or pharmacies.
  - 📋 **"Copy Text":** One-click copy of the complete prescription text.

---

## 4. File Directory Map

```
BreatheWell/
|-- index.html                 # Main landing hub & emergency safety center
|-- exercises.html             # Interactive breathing studio & session player
|-- breath-test.html           # Respiratory lab (BOLT & resting BPM counter)
|-- test.html                  # Alias/mirror for respiratory assessment lab
|-- health-tracker.html        # Clinical vitals tracking (BP & Blood Glucose)
|-- prescriptions.html         # Digital prescription vault & refill scheduler
|-- create-prescription.html   # Digital prescription creator studio & pad
|-- README.md                  # Quick-start installation and overview guide
|-- doc/                       # Comprehensive documentation suite
|   |-- README.md              # Master documentation index
|   |-- FEATURE_DOCUMENTATION.md # Full technical & functional specifications
|   |-- PROJECT_CHARTER.md     # Official project charter
|   |-- MILESTONES.md          # Phased milestones & release roadmap
|-- asset/
    |-- css/
    |   |-- style.css          # Core design system & mobile drawer styling
    |   |-- health-tracker.css # Vitals tracker styling, gauges & chart skins
    |   |-- prescriptions.css  # Prescription gallery, tags & lightbox styles
    |   |-- create-prescription.css # Studio layout, paper pad, & print styles
    |-- js/
    |   |-- script.js          # Core engine (Breathing, BOLT, i18n, Drawer)
    |   |-- script.jt          # Byte-for-byte mirrored script verification copy
    |   |-- health-tracker.js  # Vitals logging, AHA/ADA engines, charts, export
    |   |-- prescriptions.js   # Image optimizer, OCR, schedule, refill engine
    |   |-- create-prescription.js # Interactive prescription pad authoring engine
    |-- image/
        |-- logo.svg           # High-resolution vector brand mark
        |-- favicon.svg        # Browser tab favicon
        |-- hero-illustration.svg # Interactive hero visual
        |-- box-breathing.svg  # Box breathing iconography
        |-- relaxing.svg       # 4-7-8 relaxing breathing iconography
        |-- diaphragmatic.svg  # Diaphragmatic breathing iconography
        |-- mindful.svg        # Mindful breathing iconography
```


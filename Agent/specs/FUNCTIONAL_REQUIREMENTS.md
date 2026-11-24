# BreatheWell — Functional Requirements Specification

> **Document ID:** BW-SPEC-FUNCTIONAL-2026  
> **Version:** 2.4.0  
> **Status:** Released & Operational  
> **Classification:** Engineering & Functional Requirements  

---

## 1. Introduction

This document details the functional specifications for every module, user journey, diagnostic tool, clinical engine, and utility in the **BreatheWell** platform. Each requirement is assigned a unique identifier (`FR-xxx`) and defined with concrete inputs, outputs, state transitions, validation rules, and error handling protocols.

---

## 2. Module 1: Guided Respiration Engine

### 2.1 Respiration Practices & Cadence Table
The system implements four clinically validated breathing protocols, each with three adjustable difficulty tiers (Beginner, Intermediate, Advanced) modifying the phase durations:

| Protocol ID | Modality | Scientific Basis | Phases (Inhale - Hold - Exhale - Hold) |
| :--- | :--- | :--- | :--- |
| `box` | **Box Breathing** | Autonomic equilibrium, military focus | 4s - 4s - 4s - 4s (Standard) |
| `478` | **Relaxing 4-7-8** | Parasympathetic activation, sleep induction | 4s - 7s - 8s - 0s |
| `pranayama` | **Nadi Shodhana** | Alternate nostril respiration | 4s - 4s - 4s - 0s |
| `deep` | **Diaphragmatic** | Vagal nerve stimulation, cortisol reduction | 4s - 2s - 6s - 0s |

### 2.2 Functional Requirements

- **`FR-RESP-001` Mode & Level Selection:**
  - The user can select any of the 4 breathing modalities and switch between Beginner (shorter cycle, lower cycle count), Intermediate, and Advanced (longer cycle, higher cycle count).
  - Selected parameters update the live cycle duration counter and phase breakdown pills.
- **`FR-RESP-002` Animated Visual Respiration Stage:**
  - Guided breathing must render via `requestAnimationFrame` (rAF) for sub-millisecond precision.
  - The central breathing circle scales up smoothly during Inhale (`scale(1.35)`), holds steady during Hold, contracts during Exhale (`scale(1.0)`), and remains at rest during Hold after exhale.
  - An SVG circular progress ring tracks elapsed phase progress with smooth CSS stroke-dashoffset transitions.
- **`FR-RESP-003` Audio Chiming & Procedural Synthesis:**
  - Audio chimes must use the Web Audio API with zero external audio assets.
  - Inhale phase triggers a soothing two-tone bell (frequencies: 528Hz & 792Hz, gentle exponential decay).
  - Exhale phase triggers a grounding lower-frequency chime (frequencies: 396Hz & 594Hz).
  - A user-facing mute toggle allows silent breathing sessions without interrupting timers.
- **`FR-RESP-004` Text-to-Speech (TTS) Voice Coach:**
  - In supported browsers, the Web Speech API announces phase transitions ("শ্বাস নিন / Inhale", "ধরে রাখুন / Hold", "শ্বাস ছাড়ুন / Exhale").
  - The voice language automatically matches the active application locale (`bn-BD` or `en-US`).
- **`FR-RESP-005` Session Telemetry & Confetti Celebration:**
  - When the configured cycles complete, the session timer stops, celebratory canvas confetti bursts across the screen, and total mindful minutes are calculated and added to the user's streak in `localStorage`.
  - A post-session reflection prompt allows the user to record their post-exercise mood (Calm, Refreshed, Neutral, Distracted).

---

## 3. Module 2: Respiratory Diagnostic Lab

### 3.1 Body Oxygen Level Test (BOLT)
- **`FR-DIAG-001` BOLT Assessment Workflow:**
  - User breathes normally for 2-3 cycles, then takes a normal breath in, exhales normally through the nose, holds their breath, and clicks "Start Timer".
  - The stopwatch runs with 0.1-second resolution.
  - The user clicks "Stop" at the first definite physical urge to breathe (diaphragm twitch, swallow reflex).
- **`FR-DIAG-002` Clinical BOLT Score Evaluation:**
  - **< 10 seconds:** Poor pulmonary efficiency; frequent hyperventilation symptoms. System recommends gentle Diaphragmatic breathing.
  - **10 - 20 seconds:** Moderate reserve; mild exercise-induced breathlessness. System recommends Box Breathing.
  - **20 - 30 seconds:** Good respiratory fitness; optimal carbon dioxide tolerance.
  - **> 30 seconds:** Superior athletic respiration; elite autonomic balance.
  - Results are saved to `bw_bolt_history` with timestamp, duration, and score tier.

### 3.2 Resting Breaths Per Minute (BPM) Counter
- **`FR-DIAG-003` BPM Tap Counter:**
  - User taps the large breathing pulse sensor once for each completed breath (in + out).
  - A 60-second countdown runs, or dynamic rate extrapolation calculates BPM after a minimum of 3 breath taps over 15 seconds.
  - **Evaluation Criteria:**
    - `< 10 BPM:` Very deep/slow mindful breathing.
    - `12 - 18 BPM:` Healthy normal adult resting respiration.
    - `19 - 24 BPM:` Elevated respiration rate (mild stress/exertion).
    - `> 24 BPM:` Tachypnea (shallow rapid breathing; triggers an alert and deep breathing recommendation).

---

## 4. Module 3: Clinical Vitals Telemetry Suite

### 4.1 Blood Pressure (AHA 2017 Classification)
- **`FR-VIT-001` Blood Pressure Input Validation:**
  - Systolic BP: integer between `60` and `280` mmHg.
  - Diastolic BP: integer between `40` and `180` mmHg.
  - Pulse / Heart Rate: integer between `30` and `220` bpm.
  - System prevents submission if Systolic is less than or equal to Diastolic.
- **`FR-VIT-002` AHA Classification Engine:**
  The engine classifies the reading based on the worst-performing metric:

| Classification | Systolic (mmHg) | Logical | Diastolic (mmHg) | Badge Color |
| :--- | :---: | :---: | :---: | :---: |
| **Normal** | < 120 | AND | < 80 | `#10b981` (Emerald) |
| **Elevated** | 120 - 129 | AND | < 80 | `#f59e0b` (Amber) |
| **Hypertension Stage 1** | 130 - 139 | OR | 80 - 89 | `#ea580c` (Orange) |
| **Hypertension Stage 2** | ≥ 140 | OR | ≥ 90 | `#ef4444` (Rose) |
| **Hypertensive Crisis** | > 180 | OR | > 120 | `#991b1b` (Crimson Glow) |
| **Hypotension (Low BP)** | < 90 | OR | < 60 | `#8b5cf6` (Purple) |

### 4.2 Blood Glucose (ADA 2024 Standards)
- **`FR-VIT-003` Glucose Context & Unit Switching:**
  - Support for `mg/dL` (integer `20` - `600`) and `mmol/L` (float `1.1` - `33.3`).
  - Contextual meal tags: Fasting (খালি পেট), Post-meal (খাবারের পর), Random (সাধারণ).
- **`FR-VIT-004` ADA Classification Rules:**
  - **Fasting:** Normal (`70 - 99 mg/dL`), Pre-diabetes (`100 - 125 mg/dL`), Diabetes (`≥ 126 mg/dL`), Hypoglycemia (`< 70 mg/dL`).
  - **Post-meal (2h):** Normal (`< 140 mg/dL`), Pre-diabetes (`140 - 199 mg/dL`), Diabetes (`≥ 200 mg/dL`).

### 4.3 Data Visualization & Exporting
- **`FR-VIT-005` Responsive SVG Analytics:**
  - Time-series trend lines with color-coded safe-zone background bands.
  - Interactive tooltips showing exact timestamp, reading, and clinical tier on mouse hover or touch tap.
- **`FR-VIT-006` DataTables 2 Logging & Export:**
  - High-density table featuring pagination, column-based sorting, and live text search.
  - One-click RFC 4180 CSV export with UTF-8 BOM encoding for complete Bengali script preservation in Microsoft Excel.
  - One-click encrypted JSON backup and restore facility.

---

## 5. Module 4: Clinical Prescription Suite

### 5.1 Prescription Vault & Client OCR (`prescriptions-volt.html`)
- **`FR-RX-001` Multi-Format Ingestion & Downsampling:**
  - Drag-and-drop or file selector accepting JPG, PNG, WEBP, and PDF files.
  - In-browser HTML5 canvas downsamples high-resolution smartphone camera captures to max `1200px` width/height at `72%` quality JPEG to prevent `localStorage` exhaustion.
  - Multi-page PDF files are rendered page-by-page via local PDF.js.
- **`FR-RX-002` Tesseract.js Client OCR & Regex Parsing:**
  - Scanned images are processed client-side by Tesseract.js v5.
  - Regular expressions scan text for doctor names (`Dr\.?\s+[A-Za-z.]+`), hospital names, patient demographics, and medication patterns (`Tab|Cap|Syp|Inj|Inhaler`).
- **`FR-RX-003` Refill Countdowns & Vault Gallery:**
  - Displays remaining days until medication refill.
  - Color-coded urgency badges: Normal (green), Follow-up (amber), Urgent (red).

### 5.2 Digital Prescription Creator Studio (`prescription-create.html`)
- **`FR-RX-004` Two-Way Synchronized Editor:**
  - Left panel provides structured inputs: Doctor credentials, Patient demographics, Clinical examination (C/C, O/E, BP, Pulse, Weight), Investigations (Inv), Diagnosis (Dx), Medication builder, and Advice.
  - Right panel displays a live, pixel-perfect WYSIWYG hospital paper pad. Every keystroke in the left form immediately updates the paper pad preview.
- **`FR-RX-005` Clinical Medication Builder:**
  - Allows adding medicines with Drug Form (Tablet, Capsule, Syrup, Inhaler, Injection), Brand Name, Dosage (e.g. 500mg), Frequency (১+০+১, ১+১+১, প্রয়োজনমত), Duration (৭ দিন, ১ মাস), and Instructions (খাবারের পরে, খালি পেটে).
  - Medicines are rendered in a clean clinical table with action buttons to remove or reorder.
- **`FR-RX-006` Pixel-Perfect A4 Printing & WhatsApp Dispatch:**
  - `@media print` eliminates all navbar, sidebar, buttons, and form controls, rendering an authentic hospital prescription sheet with header letterhead, two-column layout, cursive ℞ symbol, and doctor signature block.
  - "WhatsApp Share" generates a formatted medical plaintext summary with deep-linked URL to send directly to patients.

### 5.3 Dedicated Live Prescription Pad (`prescription-pad.html`)
- **`FR-RX-007` In-Place Direct Contenteditable Editing:**
  - Operates without form panels. Users click directly on any element of the paper pad (Doctor name, hospital name, patient name, advice) to edit text in place using `contenteditable="true"`.
  - Changes automatically synchronize to internal state and persist to storage.

### 5.4 Digital Pad History (`digitalpad-history.html`)
- **`FR-RX-008` Dual-View Archive:**
  - Seamlessly toggles between **Format A (Card Grid)** and **Format B (DataTables 2 Table)**.
  - Card view displays doctor avatar, patient name, serial badge, vitals chips, and diagnosis.
  - Table view provides multi-column sorting, search filtering, and CSV export.
- **`FR-RX-009` Full Clinical Modal Pad Viewer:**
  - Clicking "View" on any record opens `#dhDetailModal` containing the complete clinical pad, with print, WhatsApp share, and copy capabilities.

---

## 6. Module 5: Identity, Member Profile & Security

- **`FR-AUTH-001` Local-Only Authentication Simulation:**
  - Login and Registration flows validate input format (email regex, password length ≥ 8 characters with upper, lower, and digit).
  - 1-Click "Healthcare Demo Login" populates valid clinician/patient credentials for rapid evaluation.
  - Session state is saved in `bw_user_profile` in `localStorage`.
- **`FR-AUTH-002` Member Profile Dashboard:**
  - Visual vitality cards: Total Mindful Respiration Minutes, Completed Sessions, Latest BOLT Score, Active Streak Days.
  - Tabbed settings: Personal Profile, Wellness Goals, Clinical Achievements, and Data Security.
  - One-click "Download All Health Data (JSON)" and "Erase All Data" functions.
- **`FR-AUTH-003` Family PIN Security Lock:**
  - Users can enable a 4-digit numeric PIN to protect health history and prescriptions.
  - PIN is hashed using a client-side salted SHA-256 algorithm before storing in `localStorage`.

---

## 7. Module 6: Bilingual Localization Engine

- **`FR-I18N-001` Universal Reactive Language Switching:**
  - System supports Bengali (`bn`) and English (`en`).
  - Active language is persisted in `bw_lang`.
  - When the user toggles the language button (`#langToggle` or mobile drawer pills), the engine iterates through all DOM elements with `data-i18n`, `data-rx-i18n`, `data-ph-i18n`, `data-cp-i18n`, `data-pp-i18n`, and `data-dh-i18n` attributes, instantaneously updating `textContent` and `placeholder`.
  - A custom window event `bwLanguageChanged` is dispatched to inform sub-controllers (charts, data tables) to re-render without reloading the page.
- **`FR-I18N-002` 100% Dictionary Parity:**
  - All 255+ translation keys exist in both Bengali and English dictionaries across all scripts.

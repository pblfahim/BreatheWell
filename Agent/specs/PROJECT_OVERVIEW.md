# BreatheWell — Project Overview & Architecture Specification

> **Document ID:** BW-SPEC-OVERVIEW-2026  
> **Version:** 2.4.0 (Enterprise Production Build)  
> **Status:** Released & Operational  
> **Classification:** Comprehensive Technical & Operational Specification  
> **Repository:** `j:\Development\BreatheWell`  
> **Target Audience:** Developers, Healthcare Informatics Reviewers, UI/UX Architects, Medical Advisors  

---

## 1. Executive Summary

**BreatheWell** (ডিজিটাল শ্বাসপ্রশ্বাস ও সুস্থতা হাব) is an enterprise-grade, offline-capable, client-side digital health and evidence-based respiratory wellness web application. Engineered strictly with high-performance vanilla web standards (**HTML5, CSS3, Bootstrap 5.3.3, and ES6+ JavaScript**), BreatheWell delivers a zero-latency, zero-cloud-dependency clinical wellness suite directly inside any modern web browser.

The platform addresses two prevalent global healthcare crises:
1. **The surge in chronic stress, anxiety-induced respiratory dysregulation, hypertension, and Type 2 diabetes.**
2. **The pervasive intrusion on patient privacy in commercial digital health apps**, which frequently monetize personal health information (PHI), mandate cloud-based accounts, or gate critical biometric telemetry behind recurring subscription paywalls.

BreatheWell operates on a **100% Privacy-First Architecture**: all patient biometrics, respiratory logs, optical character recognition (OCR) scans, medication histories, and clinical prescriptions reside exclusively in the client browser's `localStorage`. **Zero bytes of personal health data ever leave the user's device.**

---

## 2. Strategic Vision & Core Value Propositions

```
+---------------------------------------------------------------------------------------------------+
|                                  BreatheWell Platform Architecture                                |
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
|  |  | Studio Form + WYSIWYG Pad|  | Dedicated WYSIWYG Paper|  |   Dual View Archive & Print |  |  |
|  |  +--------------------------+  +------------------------+  +-----------------------------+  |  |
|  +---------------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

### 2.1 Core Value Pillars
1. **Absolute Privacy by Design:** 
   No backend servers, no analytics trackers, no telemetric beacons. Biometric records (blood pressure, blood glucose, heart rate) and uploaded documents are stored in client-side storage with optional client-side salted PIN hashing.
2. **Zero-Barrier Access:** 
   Immediate operational availability. Users can open the web app from anywhere, even with intermittent connectivity or completely offline, without creating an account or paying fees.
3. **Evidence-Based Medical & Respiration Protocols:**
   - **Box Breathing (Sama Vritti):** 4-4-4-4 cadence for autonomic nervous system equilibrium.
   - **4-7-8 Breathing (Dr. Andrew Weil):** Parasympathetic activation and insomnia relief.
   - **Deep Calm (Diaphragmatic):** 4-2-6 cadence reducing sympathetic tone and cortisol.
   - **Pranayama (Nadi Shodhana):** 4-4-4 balance protocol for mental clarity.
   - **Body Oxygen Level Test (BOLT):** Dr. Patrick McKeown / Oxygen Advantage pulmonary efficiency diagnostic.
   - **AHA 2017 Guidelines:** Blood pressure stage classification (Normal, Elevated, Stage 1, Stage 2, Hypertensive Crisis).
   - **ADA 2024 Standards:** Blood glucose categorization (Fasting, Postprandial, Random across Normal, Pre-diabetic, Diabetic, Hypoglycemic).
4. **First-Class Bilingual Parity:**
   Native, complete localization across Bengali (`bn`) and English (`en`) with instantaneous, reactive language switching without page reloads.

---

## 3. Technology Stack & Library Inventory

BreatheWell is built purely on native web standards and locally hosted vendor assets. It has **zero runtime CDN dependencies**, ensuring complete operational resilience and security.

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Markup** | HTML5 | Living Standard | Semantic document architecture, WAI-ARIA landmarks |
| **Styling** | CSS3 / Scoped Tokens | CSS3 Living Standard | Custom properties, responsive flexbox/grid, `@media print` |
| **CSS Framework** | Bootstrap | 5.3.3 (Local) | Grid system, modal backdrops, offcanvas drawer |
| **Typography** | Google Fonts (Local) | Inter & Noto Sans Bengali | Tabular numbers, dual-script typographical harmony |
| **Iconography** | Bootstrap Icons | 1.11.3 (Local) | Vector glyphs for clinical navigation and actions |
| **Core Scripting** | JavaScript (ES6+) | ECMAScript 2022+ | Vanilla client-side controller logic, rAF animation loops |
| **Data Tables** | DataTables 2 | 2.0+ (Local) | High-performance clinical record pagination and column sorting |
| **Table Bridge** | jQuery | 3.7.1 (Local) | DataTables 2 DOM integration bridge |
| **OCR Engine** | Tesseract.js | v5 (Local Vendor) | In-browser optical character recognition on scanned prescriptions |
| **Document Engine** | PDF.js | 3.11+ (Local Vendor) | In-browser canvas rasterization for PDF prescription files |
| **Audio Engine** | Web Audio API | Native W3C Standard | Pure procedural synthetic audio chimes (sine/triangle oscillators) |
| **Speech Engine** | Web Speech API | Native W3C Standard | Real-time voice coaching (`SpeechSynthesisUtterance`) |

---

## 4. Architectural Boundaries & System Constraints

To maintain enterprise quality and deterministic reliability, BreatheWell adheres to four non-negotiable architectural mandates:

1. **Zero Inline Code Policy:**
   - `0` inline `<style>` tags.
   - `0` inline `<script>` tags.
   - All styling resides in dedicated, modular CSS files in `asset/css/`.
   - All scripting resides in modular JS files in `asset/js/`.
2. **Deterministic Script Mirroring:**
   - Byte-for-byte SHA256 equality is maintained between `asset/js/script.js` and `asset/js/script.jt`.
3. **Local Vendor Self-Sufficiency:**
   - 100% of vendor scripts, CSS, and fonts are stored in `asset/vendor/`. No external CDN calls (`jsdelivr`, `cdnjs`, `unpkg`, `fonts.googleapis.com`) are permitted.
4. **Client-Side Data Isolation:**
   - All application state is persisted in `localStorage` under namespaced keys (`bw_prescriptions`, `bw_digitalpad_prescriptions`, `bw_vitals_records`, `bw_lang`, `bw_user_profile`).

---

## 5. High-Level Module Matrix

The platform is divided into four principal clinical and wellness modules:

```
+---------------------------------------------------------------------------------------------------------+
| BreatheWell Module Breakdown                                                                            |
+------------------------------------+--------------------------------------------------------------------+
| Module                             | Key Files & Responsibilities                                       |
+------------------------------------+--------------------------------------------------------------------+
| 1. Guided Respiration & Diagnostic | - exercises.html / asset/js/exercises.js / asset/css/exercises.css |
|    Assessment Suite                | - breath-test.html / asset/js/breath-test.js / asset/css/...       |
|                                    | - 4 breathing practices, rAF animation circle, audio chimes,       |
|                                    |   TTS coach, BOLT test stopwatch, resting BPM counter.             |
+------------------------------------+--------------------------------------------------------------------+
| 2. Clinical Vitals Telemetry Suite | - health-reading.html, health-history.html, health-charts.html,   |
|                                    |   health-demo.html / asset/js/health-*.js                          |
|                                    | - AHA 2017 BP classification, ADA 2024 Glucose evaluation,        |
|                                    |   DataTables 2 clinical history log, responsive SVG charts.        |
+------------------------------------+--------------------------------------------------------------------+
| 3. Prescription Vault & Digital    | - prescriptions-volt.html, prescription-history.html,              |
|    Studio Suite                    |   prescription-create.html, prescription-pad.html,                 |
|                                    |   digitalpad-history.html                                          |
|                                    | - In-browser OCR scan, dual-format history (cards & tables),       |
|                                    |   live WYSIWYG doctor prescription pad, pixel-perfect A4 print.    |
+------------------------------------+--------------------------------------------------------------------+
| 4. Identity & Member Dashboard     | - login.html, register.html, profile.html / asset/js/global-nav.js |
|                                    | - 1-Click healthcare demo auth, member vitality score,             |
|                                    |   HIPAA-compliant JSON data backup, profile settings.              |
+------------------------------------+--------------------------------------------------------------------+
```

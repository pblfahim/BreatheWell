# BreatheWell Documentation Suite

Welcome to the official technical and operational documentation repository for **BreatheWell** (ডিজিটাল শ্বাসপ্রশ্বাস ও সুস্থতা হাব).

---

## Documentation Index

This directory contains comprehensive product specifications, engineering standards, project charters, and milestone roadmaps for the BreatheWell platform:

1. **[Feature-Based Documentation (`FEATURE_DOCUMENTATION.md`)](file:///j:/Development/BreatheWell/doc/FEATURE_DOCUMENTATION.md)**
   - Technical and functional breakdown of all 7 modules:
     - Universal Navigation & Mobile Sidebar Drawer
     - Home Wellness Hub & Safety Center (`index.html`)
     - Guided Breathing Studio & Audio/TTS Engine (`exercises.html`)
     - Respiratory Assessments Lab: BOLT & BPM Counter (`breath-test.html`)
     - Clinical Vitals Health Tracker: BP & Blood Glucose Engines (`health-tracker.html`)
     - Prescription & Medication Vault with Client OCR (`prescriptions.html`)
     - **Digital Prescription Creator Studio & Interactive Pad (`create-prescription.html`)**
   - Bilingual localization architecture (255 core keys with 100% parity).
   - Client-side storage schemas, canvas image compression, and security guidelines.

2. **[Official Project Charter (`PROJECT_CHARTER.md`)](file:///j:/Development/BreatheWell/doc/PROJECT_CHARTER.md)**
   - Executive Summary and Strategic Business Case.
   - Project Vision & SMART Objectives.
   - Formal Scope Boundaries (In-Scope vs. Out-of-Scope).
   - Architectural Constraints (Zero-inline policy, pure vanilla JS, script mirroring).
   - Risk Management Matrix & Quality Assurance Gates.

3. **[Project Milestones & Release Roadmap (`MILESTONES.md`)](file:///j:/Development/BreatheWell/doc/MILESTONES.md)**
   - Phased lifecycle breakdown from v1.0.0 through v2.0.0.
   - Includes completed Milestone 6: Digital Prescription Creator Studio.
   - Future horizons: PWA offline cache and WebAuthn biometrics.

---

## Architectural Principles at a Glance

- **100% Privacy by Design:** 0 bytes of health metrics ever transmitted over external networks.
- **Zero-Inline Policy:** 0 inline `<style>` and 0 inline `<script>` tags across all HTML pages.
- **Script Mirroring:** `asset/js/script.js` and `asset/js/script.jt` are byte-for-byte identical (SHA256 hash match).
- **Dual-Language Parity:** Complete 1:1 translation mapping between Bengali (`bn`) and English (`en`).
- **Semantic HTML:** All container tags (`div`, `nav`, `section`, `footer`) strictly balanced (Diff = 0).


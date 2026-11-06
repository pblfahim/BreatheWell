# BreatheWell — Official Project Charter

> **Document ID:** BW-CHARTER-2026-V1  
> **Project Name:** BreatheWell (ডিজিটাল শ্বাসপ্রশ্বাস ও সুস্থতা হাব)  
> **Project Type:** Client-Side Digital Health & Mindful Wellness Platform  
> **Document Version:** 1.5.0  
> **Date of Issue:** November 2026  
> **Classification:** Public Technical & Operational Charter  

---

## 1. Executive Summary

The **BreatheWell Project** was initiated to design, develop, and deliver a modern, privacy-first, bilingual digital health platform that combines evidence-based respiratory exercises, clinical lung assessments, cardiovascular and glycemic vitals tracking, an offline prescription vault, and a digital prescription creator studio into a unified, zero-latency web application.

Engineered entirely with native web standards (HTML5, CSS3, Bootstrap 5.3.3, and ES6+ JavaScript), BreatheWell operates without requiring user accounts, external databases, or third-party cloud servers. Every health metric, test result, and medical document remains strictly on the user's personal device, establishing a new standard for patient privacy in digital health tools.

---

## 2. Business Case & Problem Statement

### 2.1 Problem Statement
- **Respiratory & Chronic Health Epidemics:** Rapid urbanization and sedentary lifestyles have caused surging rates of anxiety-induced hyperventilation, pulmonary compromise, hypertension, and Type 2 diabetes across urban and regional populations, particularly in South Asia.
- **Privacy Intrusion in Commercial Health Apps:** Most digital health applications require mandatory cloud accounts, harvest personal biometric data for third-party monetization, or restrict critical health features behind subscription paywalls.
- **Language & Cultural Barriers:** Major medical and mindfulness apps are designed primarily for Western English-speaking demographics, lacking culturally adapted interfaces, native Bengali terminology, and localized emergency directory support.
- **Connectivity Disparities:** Users frequently face unstable mobile internet connectivity, rendering heavy cloud-dependent single-page applications slow, unreliable, or completely inaccessible.

### 2.2 Strategic Value & Justification
BreatheWell addresses these critical challenges by offering:
1. **Immediate Zero-Barrier Access:** Instant operational availability in any standard web browser without sign-ups or payments.
2. **Absolute Privacy by Design:** 100% of user data is stored locally in the browser's `localStorage` and never transmitted across the network.
3. **Native Bilingual Equality:** First-class Bengali and English localization with 100% dictionary key parity.
4. **Resilient Offline Architecture:** Complete offline operability once static assets are cached.

---

## 3. Project Scope Definition

### 3.1 In-Scope Deliverables
1. **Core Interactive Home & Wellness Hub (`index.html`):** Interactive hero breathing companion, exercise catalog, deep-link launcher, and emergency safety center.
2. **Guided Respiration Studio (`exercises.html`):** 4 clinical breathing practices, 3 difficulty tiers, visual breathing guide, audio chiming, speech synthesis, and canvas confetti.
3. **Respiratory Assessment Lab (`breath-test.html` / `test.html`):** Body Oxygen Level Test (BOLT) stopwatch and resting Breaths Per Minute (BPM) tap counter with local telemetry.
4. **Clinical Vitals Health Tracker (`health-tracker.html`):** AHA blood pressure and ADA blood glucose tracking, SVG sparklines, trend graphs, CSV export, and family PIN security lock.
5. **Prescription & Medication Vault (`prescriptions.html`):** Canvas image compression, regex client OCR parser, dosage scheduling, and refill countdown alerts.
6. **Digital Prescription Creator Studio (`create-prescription.html`):** Interactive hospital prescription pad authoring engine with doctor info, patient vitals, C/C, H/O, O/E, Inv, Dx, Rx medicines table, advice, one-click PDF sample pre-fill, pixel-perfect print layout, and WhatsApp sharing.
7. **Mobile Navigation Drawer (`#mobileSidebarMenu`):** Responsive offcanvas drawer (< 992px) with language switcher, main links, and Emergency SOS quick card.

### 3.2 Out-of-Scope (Boundaries)
- Centralized cloud database synchronization (e.g., Firebase, AWS RDS).
- Cloud-based user account authentication.
- Automated tele-consultation video streaming.
- Prescription drug purchasing or commercial payment gateways.
- Replacement of certified medical diagnoses or clinical triage procedures.

---

## 4. Technical Constraints & Engineering Rules

- **Zero-Inline Code:** 0 inline `<style>` and 0 inline `<script>` tags across all HTML pages.
- **Script Mirroring:** Byte-for-byte SHA256 equality maintained between `script.js` and `script.jt`.
- **Storage Governance:** LocalStorage quota guard with client canvas downsampling (max 1200px, 72% JPEG) and 4MB caution alerts.
- **Bilingual Parity:** Complete 1:1 translation mapping between Bengali (`bn`) and English (`en`).
- **Semantic HTML:** All container tags (`div`, `nav`, `section`, `footer`) strictly balanced (Diff = 0).

---

## 5. High-Level Project Milestones

| Milestone ID | Description | Target Version | Status |
| :---: | :--- | :---: | :---: |
| **M1** | Core Architecture & Breathing Studio | v1.0.0 | **COMPLETED** |
| **M2** | Respiratory Assessment Lab (BOLT & BPM) | v1.1.0 | **COMPLETED** |
| **M3** | Clinical Vitals Health Tracker (BP & BG) | v1.2.0 | **COMPLETED** |
| **M4** | Prescription Vault & Client OCR | v1.3.0 | **COMPLETED** |
| **M5** | Mobile Sidebar Drawer & Universal Routing | v1.4.0 | **COMPLETED** |
| **M6** | Digital Prescription Creator Studio & Pad | v1.5.0 | **COMPLETED** |
| **M7** | PWA Service Worker & Offline Cache | v1.6.0 | **PLANNED** |
| **M8** | Biometric WebAuthn & Encrypted Cloud Sync | v2.0.0 | **ROADMAP** |

---

## 6. Project Governance & Sign-Off

- **Lead Systems Architect:** Architecture, standards compliance, and milestone delivery.
- **Frontend / UX Engineer:** Responsive UI, zero-inline policy, and print styling.
- **Clinical Advisor:** Medical accuracy of AHA/ADA ranges and prescription pad layout.
- **QA Automation Lead:** Automated regression tests and script hash parity verification.


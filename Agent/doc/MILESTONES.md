# BreatheWell — Project Milestones & Release Roadmap

> **Document ID:** BW-ROADMAP-2026-V1  
> **Classification:** Project Lifecycle & Release Schedule  
> **Current Version:** 1.5.0 (Operational)  
> **Last Updated:** November 2026  

---

## 1. Milestone Roadmap Overview

```
[M1: Breathing Studio] ===> [M2: Respiratory Lab] ===> [M3: Vitals Tracker]
     (v1.0.0 - DONE)             (v1.1.0 - DONE)            (v1.2.0 - DONE)
                                                                  |
[M6: Rx Creator Studio] <=== [M5: Mobile Drawer]  <=== [M4: Rx Vault]
     (v1.5.0 - DONE)             (v1.4.0 - DONE)            (v1.3.0 - DONE)
            |
            v
[M7: PWA & Offline]    ===> [M8: Cloud & WebAuthn]
  (v1.6.0 - PLANNED)              (v2.0.0 - ROADMAP)
```

---

## 2. Milestone Details

### Milestone 1 (M1): Foundation & Breathing Studio
- **Version:** `v1.0.0` — **COMPLETED**
- 4 clinical exercises, 3 difficulty tiers, SVG breathing circle, Web Audio chiming, speech synthesis, confetti physics, streak tracking.

### Milestone 2 (M2): Respiratory Diagnostic Lab
- **Version:** `v1.1.0` — **COMPLETED**
- BOLT assessment stopwatch, BPM breathing rate tap counter, clinical feedback, local test history.

### Milestone 3 (M3): Clinical Vitals Health Tracker
- **Version:** `v1.2.0` — **COMPLETED**
- Blood pressure (AHA) and blood glucose (ADA) logging, SVG sparklines, trend charts, doctor CSV export, family PIN security lock.

### Milestone 4 (M4): Digital Prescription Vault & Client OCR
- **Version:** `v1.3.0` — **COMPLETED**
- In-browser canvas image downsampling (1200px / 72% JPEG), regex OCR parser, medication scheduling, refill countdowns, lightbox gallery.

### Milestone 5 (M5): Mobile Sidebar Drawer & Universal Link Routing
- **Version:** `v1.4.0` — **COMPLETED**
- Sliding offcanvas drawer (< 992px), language switcher card, emergency pulse alert, programmatic drawer dismissal, and cross-page router.

### Milestone 6 (M6): Digital Prescription Creator Studio & Interactive Pad
- **Version:** `v1.5.0` — **COMPLETED**
- Dedicated clinical authoring suite (`prescription-create.html`, `prescription-create.css`, `prescription-create.js`).
- Complete hospital prescription pad layout based on clinical PDF standards (Dr. A. Rahman, City General Hospital):
  - Doctor & Clinic header (degrees, reg no, address, phone)
  - Patient vital header bar (name, age, sex, date)
  - Left column: C/C (Chief Complaints), H/O (History), O/E (BP, Pulse, Temp, Weight), Inv (Investigations)
  - Right column: Dx (Diagnosis), large cursive `Rx` symbol, structured medicines schedule table, doctor's advice
- One-click "Load Sample (From PDF)" populating exact sample data.
- Pixel-perfect `@media print` producing authentic hospital sheets on standard A4 paper without web UI chrome.
- LocalStorage vault persistence and structured WhatsApp sharing.

### Milestone 7 (M7): Progressive Web App (PWA) & Offline Reliability
- **Version:** `v1.6.0` — **PLANNED / NEXT PHASE**
- Service worker caching static assets, install prompt for mobile/desktop, offline notification alarms for scheduled medication times.

### Milestone 8 (M8): Biometric WebAuthn & Encrypted Cloud Sync
- **Version:** `v2.0.0` — **ROADMAP**
- Fingerprint/FaceID unlock replacing PIN, end-to-end encrypted peer-to-peer cloud sync, Web Bluetooth pulse oximeter and BP cuff integration.

---

## 3. Milestone Tracking Summary

| Milestone | Target Version | Focus Area | Status |
| :---: | :---: | :--- | :---: |
| **M1** | v1.0.0 | Foundation & Breathing Studio | **COMPLETED** |
| **M2** | v1.1.0 | Respiratory Diagnostic Lab | **COMPLETED** |
| **M3** | v1.2.0 | Clinical Vitals Health Tracker | **COMPLETED** |
| **M4** | v1.3.0 | Prescription Vault & Client OCR | **COMPLETED** |
| **M5** | v1.4.0 | Mobile Drawer & Universal Routing | **COMPLETED** |
| **M6** | v1.5.0 | Prescription Creator Studio & Pad | **COMPLETED** |
| **M7** | v1.6.0 | PWA Service Worker & Offline Cache | **PLANNED** |
| **M8** | v2.0.0 | Biometric WebAuthn & Encrypted Sync | **ROADMAP** |


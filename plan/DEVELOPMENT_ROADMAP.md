# BreatheWell — Strategic Development Roadmap

> **Document ID:** BW-PLAN-ROADMAP-2026  
> **Version:** 2.4.0 (Forward Horizons)  
> **Classification:** Engineering Strategy & Product Roadmap  

---

## 1. Roadmap Horizon Overview

BreatheWell is advancing from an operational client-side web application into an offline-first Progressive Web App (PWA) with decentralized, privacy-preserving biometric capabilities:

```text
2026 Q4 (Completed)    ===> 2027 Q1 (Phase 7)      ===> 2027 Q2-Q3 (Phase 8)
- Modular Pages Suite       - PWA Service Worker        - WebAuthn Biometrics
- Prescription Studio & Pad - Background Audio Alarms   - Encrypted P2P Sync
- 100% Local Vendor Assets  - Custom Cadence Builder    - Web Bluetooth Vitals
```

---

## 2. Milestone 7 (M7): Progressive Web App (PWA) & Offline Reliability (`v1.6.0`)

### 2.1 Core Objectives
1. **Service Worker (`sw.js`) Offline Cache:**
   - Pre-caching all 16 HTML pages, CSS files, modular JS scripts, and local vendor packages (`asset/vendor/`).
   - Strategy: Cache-first with network fallback for static assets.
2. **Web App Manifest (`manifest.json`):**
   - Standalone display mode with custom theme color (`#0f4c3a`), home screen shortcuts ("Start Breathing", "Log Vitals", "Create Rx"), and adaptive icons (`192x192`, `512x512`).
3. **Offline Medication & Breathing Reminders:**
   - Web Push / Notification API integration to remind users of scheduled medication refill dates and daily mindful respiration sessions without cloud dependencies.

---

## 3. Milestone 8 (M8): Biometric WebAuthn & Encrypted Cloud Sync (`v2.0.0`)

### 3.1 Core Objectives
1. **Biometric WebAuthn Security:**
   - Replace 4-digit PIN security lock with native fingerprint (Touch ID / Android Biometric) and facial recognition (Face ID / Windows Hello) using the FIDO2 Web Authentication API.
2. **Zero-Knowledge Peer-to-Peer Encrypted Synchronization:**
   - Secure patient-to-physician synchronization via WebRTC and client-side AES-GCM-256 encryption.
   - Encrypted data blobs exchanged directly between patient smartphone and doctor workstation via QR code handshake.
3. **Web Bluetooth IoT Device Telemetry:**
   - Direct wireless ingestion from Bluetooth Low Energy (BLE) blood pressure cuffs and fingertip pulse oximeters supporting standard GATT profiles (`0x1810` Blood Pressure Service, `0x1822` Pulse Oximeter Service).

---

## 4. Feature Prioritization Matrix

```
+---------------------------------------------------------------------------------------------------------+
| Feature Priority Matrix                                                                                 |
+-------------------+--------------------+--------------------+--------------------+----------------------+
| Feature           | Clinical Impact    | Technical Effort   | Target Release     | Priority Score       |
+-------------------+--------------------+--------------------+--------------------+----------------------+
| Service Worker PWA| High (Total Offline| Medium (3 sprints) | v1.6.0 (Q1 2027)   | P0 (Critical)        |
+-------------------+--------------------+--------------------+--------------------+----------------------+
| Custom Cadence    | Medium (Patient    | Low (1 sprint)     | v1.6.5 (Q1 2027)   | P1 (High)            |
| Breathing Builder | personalization)   |                    |                    |                      |
+-------------------+--------------------+--------------------+--------------------+----------------------+
| WebAuthn Biometric| High (Zero PIN     | Medium (2 sprints) | v2.0.0 (Q2 2027)   | P1 (High)            |
| Authentication    | friction)          |                    |                    |                      |
+-------------------+--------------------+--------------------+--------------------+----------------------+
| Web Bluetooth BLE | Very High (Zero    | High (4 sprints)   | v2.1.0 (Q3 2027)   | P2 (Strategic)       |
| Hardware Vitals   | manual input error)|                    |                    |                      |
+-------------------+--------------------+--------------------+--------------------+----------------------+
```
